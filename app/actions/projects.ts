'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const projectSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  project_type: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  shoot_date: z.string().optional(),
})

const projectUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'pre_production', 'shooting', 'editing', 'review', 'delivered', 'cancelled']).optional(),
  project_type: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  shoot_date: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>
type ProjectUpdateData = z.infer<typeof projectUpdateSchema>

export async function createProject(formData: ProjectFormData) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Validate input
    const validatedData = projectSchema.parse(formData)

    // Insert project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...validatedData,
        status: 'pre_production',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Project creation error:', error)
      return { success: false, error: 'Failed to create project. Please try again.' }
    }

    // Create notification for client
    await supabase.from('notifications').insert({
      user_id: validatedData.client_id,
      type: 'project_created',
      title: 'New Project Created',
      message: `A new project "${validatedData.name}" has been created for you`,
      link: `/projects/${project.id}`,
    })

    // Revalidate
    revalidatePath('/admin/projects')
    revalidatePath('/projects')

    return { success: true, data: project }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateProject(projectId: string, formData: ProjectUpdateData) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Validate input
    const validatedData = projectUpdateSchema.parse(formData)

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update(validatedData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Project update error:', error)
      return { success: false, error: 'Failed to update project' }
    }

    // If status changed to delivered, mark as completed
    if (validatedData.status === 'delivered') {
      await supabase
        .from('projects')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', projectId)

      // Notify client
      await supabase.from('notifications').insert({
        user_id: project.client_id,
        type: 'project_delivered',
        title: 'Project Delivered',
        message: `Your project "${project.name}" has been delivered!`,
        link: `/projects/${projectId}`,
      })
    }

    // Revalidate
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/projects')
    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: project }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'
) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Get project for client notification
    const { data: project } = await supabase
      .from('projects')
      .select('client_id, name')
      .eq('id', projectId)
      .single()

    // Update project
    const updateData: any = { status }

    if (status === 'delivered') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Status update error:', error)
      return { success: false, error: 'Failed to update status' }
    }

    // Send notification to client
    if (project) {
      const statusMessages: Record<string, string> = {
        pre_production: 'is now in pre-production',
        shooting: 'is now being shot',
        editing: 'is now in editing',
        review: 'is ready for your review',
        delivered: 'has been delivered!',
        cancelled: 'has been cancelled',
      }

      await supabase.from('notifications').insert({
        user_id: project.client_id,
        type: 'project_status',
        title: 'Project Status Update',
        message: `${project.name} ${statusMessages[status]}`,
        link: `/projects/${projectId}`,
      })
    }

    // Revalidate
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/projects')
    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: updatedProject }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteProject(projectId: string) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Delete project (cascade will handle related records)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      console.error('Project deletion error:', error)
      return { success: false, error: 'Failed to delete project' }
    }

    // Revalidate
    revalidatePath('/admin/projects')
    revalidatePath('/projects')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
