import { createClient } from '@/lib/supabase/server'
import { NotificationCenter } from './NotificationCenter'

export async function NotificationCenterWrapper() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  // Fetch notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Count unread
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null)

  return (
    <NotificationCenter
      userId={user.id}
      initialNotifications={notifications || []}
      initialUnreadCount={unreadCount || 0}
    />
  )
}
