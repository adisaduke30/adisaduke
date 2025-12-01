import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read_at: string | null
  created_at: string
}

export function useRealtimeNotifications(userId: string, initialNotifications: Notification[]) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications.filter((n) => !n.read_at).length
  )
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Set initial notifications
    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read_at).length)

    // Subscribe to new notifications
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification received:', payload)
          const newNotification = payload.new as Notification
          setNotifications((current) => [newNotification, ...current])
          setUnreadCount((count) => count + 1)
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification updated:', payload)
          const updatedNotification = payload.new as Notification
          setNotifications((current) =>
            current.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          )
          // Recalculate unread count
          setNotifications((current) => {
            setUnreadCount(current.filter((n) => !n.read_at).length)
            return current
          })
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification deleted:', payload)
          setNotifications((current) => current.filter((n) => n.id !== payload.old.id))
          setUnreadCount((current) => {
            const deletedNotification = notifications.find((n) => n.id === payload.old.id)
            return deletedNotification && !deletedNotification.read_at ? current - 1 : current
          })
          router.refresh()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, router, initialNotifications])

  return { notifications, unreadCount }
}
