'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema
const messageSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  body: z.string().min(1, 'Message cannot be empty'),
  attachment_url: z.string().optional(),
  attachment_name: z.string().optional(),
  attachment_size: z.number().optional(),
})

type MessageFormData = z.infer<typeof messageSchema>

export async function sendMessage(formData: MessageFormData) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }

    // Validate input
    const validatedData = messageSchema.parse(formData)

    // Check if user has access to this project
    const { data: project } = await supabase
      .from('projects')
      .select('client_id, name')
      .eq('id', validatedData.project_id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    // Check access
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized. You do not have access to this project.' }
    }

    // Insert message
    const { data: message, error } = await supabase
      .from('project_messages')
      .insert({
        ...validatedData,
        sender_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Message send error:', error)
      return { success: false, error: 'Failed to send message. Please try again.' }
    }

    // Send notification to the other party
    const recipientId = isAdmin ? project.client_id : await getAdminId()

    if (recipientId) {
      await supabase.from('notifications').insert({
        user_id: recipientId,
        type: 'new_message',
        title: 'New Message',
        message: `You have a new message on project "${project.name}"`,
        link: isAdmin
          ? `/projects/${validatedData.project_id}`
          : `/admin/projects/${validatedData.project_id}`,
      })
    }

    // Revalidate paths
    revalidatePath(`/projects/${validatedData.project_id}`)
    revalidatePath(`/admin/projects/${validatedData.project_id}`)
    revalidatePath('/messages')
    revalidatePath('/admin/messages')

    return { success: true, data: message }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get message to verify access
    const { data: message } = await supabase
      .from('project_messages')
      .select('project_id, sender_id')
      .eq('id', messageId)
      .single()

    if (!message) {
      return { success: false, error: 'Message not found' }
    }

    // Don't mark own messages as read
    if (message.sender_id === user.id) {
      return { success: true }
    }

    // Check project access
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', message.project_id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized' }
    }

    // Mark as read
    const { error } = await supabase
      .from('project_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)

    if (error) {
      console.error('Mark as read error:', error)
      return { success: false, error: 'Failed to mark message as read' }
    }

    // Revalidate
    revalidatePath(`/projects/${message.project_id}`)
    revalidatePath(`/admin/projects/${message.project_id}`)
    revalidatePath('/messages')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function markAllMessagesAsRead(projectId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check project access
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', projectId)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized' }
    }

    // Mark all unread messages as read (except user's own messages)
    const { error } = await supabase
      .from('project_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('project_id', projectId)
      .neq('sender_id', user.id)
      .is('read_at', null)

    if (error) {
      console.error('Mark all as read error:', error)
      return { success: false, error: 'Failed to mark messages as read' }
    }

    // Revalidate
    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/messages')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get message to verify ownership
    const { data: message } = await supabase
      .from('project_messages')
      .select('sender_id, project_id')
      .eq('id', messageId)
      .single()

    if (!message) {
      return { success: false, error: 'Message not found' }
    }

    // Only message sender can delete (or admin)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isSender = message.sender_id === user.id

    if (!isAdmin && !isSender) {
      return { success: false, error: 'Unauthorized. You can only delete your own messages.' }
    }

    // Delete message
    const { error } = await supabase
      .from('project_messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      console.error('Message deletion error:', error)
      return { success: false, error: 'Failed to delete message' }
    }

    // Revalidate
    revalidatePath(`/projects/${message.project_id}`)
    revalidatePath(`/admin/projects/${message.project_id}`)
    revalidatePath('/messages')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Helper function to get admin ID
async function getAdminId(): Promise<string | null> {
  const supabase = await createClient()

  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  return admins && admins.length > 0 ? admins[0].id : null
}
