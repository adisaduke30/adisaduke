'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update notification (only if it belongs to the user)
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Notification update error:', error)
      return { success: false, error: 'Failed to mark notification as read' }
    }

    // Revalidate dashboard and header
    revalidatePath('/dashboard')
    revalidatePath('/admin/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update all unread notifications
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null)

    if (error) {
      console.error('Notifications update error:', error)
      return { success: false, error: 'Failed to mark notifications as read' }
    }

    // Revalidate
    revalidatePath('/dashboard')
    revalidatePath('/admin/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete notification (only if it belongs to the user)
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Notification deletion error:', error)
      return { success: false, error: 'Failed to delete notification' }
    }

    // Revalidate
    revalidatePath('/dashboard')
    revalidatePath('/admin/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteAllReadNotifications() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete all read notifications
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
      .not('read_at', 'is', null)

    if (error) {
      console.error('Notifications deletion error:', error)
      return { success: false, error: 'Failed to delete notifications' }
    }

    // Revalidate
    revalidatePath('/dashboard')
    revalidatePath('/admin/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getUnreadNotificationCount() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Count unread notifications
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)

    if (error) {
      console.error('Notification count error:', error)
      return { success: false, error: 'Failed to get notification count' }
    }

    return { success: true, data: count || 0 }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
