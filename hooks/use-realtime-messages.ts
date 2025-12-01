import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  body: string
  sender_id: string
  created_at: string
  read_at: string | null
}

export function useRealtimeMessages(projectId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Set initial messages
    setMessages(initialMessages)

    // Subscribe to new messages
    const channel = supabase
      .channel(`project-messages-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('New message received:', payload)
          setMessages((current) => [...current, payload.new as Message])
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Message updated:', payload)
          setMessages((current) =>
            current.map((msg) =>
              msg.id === payload.new.id ? (payload.new as Message) : msg
            )
          )
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Message deleted:', payload)
          setMessages((current) =>
            current.filter((msg) => msg.id !== payload.old.id)
          )
          router.refresh()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase, router, initialMessages])

  return messages
}
