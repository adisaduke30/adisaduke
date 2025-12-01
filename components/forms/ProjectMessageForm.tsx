'use client'

import { useState, useTransition } from 'react'
import { sendMessage } from '@/app/actions/messages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Project {
  id: string
  name: string
}

interface ProjectMessageFormProps {
  projects: Project[]
}

export function ProjectMessageForm({ projects }: ProjectMessageFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedProjectId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a project',
        variant: 'destructive',
      })
      return
    }

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
        project_id: selectedProjectId,
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
        <label className="text-sm font-medium">Project</label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={isPending}>
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={6}
          className="bg-background/50 border-border/50 resize-none"
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || !selectedProjectId || !message.trim()}
      >
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
