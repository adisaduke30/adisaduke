'use client'

import { useState, useTransition } from 'react'
import { sendMessage } from '@/app/actions/messages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MessageFormProps {
  projectId: string
}

export function MessageForm({ projectId }: MessageFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Message cannot be empty',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      const result = await sendMessage({
        project_id: projectId,
        body: message,
      })

      if (result.success) {
        toast({
          title: 'Message Sent',
          description: 'Your message has been sent successfully',
        })
        setMessage('')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send message',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="bg-background/50 border-border/50 resize-none"
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !message.trim()}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
