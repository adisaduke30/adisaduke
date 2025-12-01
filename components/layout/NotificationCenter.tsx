'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/app/actions/notifications'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Check, X, FolderKanban, MessageSquare, FileText, Calendar, CheckCheck } from 'lucide-react'
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

interface NotificationCenterProps {
  userId: string
  initialNotifications: Notification[]
  initialUnreadCount: number
}

const notificationIcons: Record<string, any> = {
  project_created: FolderKanban,
  project_status: FolderKanban,
  project_delivered: FolderKanban,
  message_received: MessageSquare,
  file_uploaded: FileText,
  booking_approved: Calendar,
  booking_declined: Calendar,
  invoice_sent: FileText,
  payment_received: FileText,
}

export function NotificationCenter({ userId, initialNotifications, initialUnreadCount }: NotificationCenterProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Use realtime notifications
  const { notifications, unreadCount } = useRealtimeNotifications(userId, initialNotifications)
  const [localNotifications, setLocalNotifications] = useState(notifications)

  // Sync local notifications with realtime updates
  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const handleMarkAsRead = (notificationId: string, link: string | null) => {
    startTransition(async () => {
      const result = await markNotificationAsRead(notificationId)
      if (result.success) {
        // Update local state
        setLocalNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
        )

        // Navigate if there's a link
        if (link) {
          router.push(link)
        }

        router.refresh()
      }
    })
  }

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead()
      if (result.success) {
        // Update local state
        setLocalNotifications(prev =>
          prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
        )
        router.refresh()
      }
    })
  }

  const handleDelete = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    startTransition(async () => {
      const result = await deleteNotification(notificationId)
      if (result.success) {
        // Remove from local state
        setLocalNotifications(prev => prev.filter(n => n.id !== notificationId))
        router.refresh()
      }
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {localNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <>
              {localNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell
                const isUnread = !notification.read_at

                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${
                      isUnread ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id, notification.link)}
                  >
                    <div className={`mt-0.5 ${isUnread ? 'text-primary' : 'text-muted-foreground'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </>
          )}
        </div>

        {localNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="text-center text-sm text-primary cursor-pointer">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
