import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Send } from 'lucide-react'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  if (profile.role === 'admin') {
    redirect('/admin/messages')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const { data: messages } = await supabase
    .from('project_messages')
    .select(`
      *,
      projects!inner(client_id, title)
    `)
    .eq('projects.client_id', user.id)
    .order('created_at', { ascending: false })

  const groupedMessages: Record<string, any[]> = {}
  messages?.forEach((msg) => {
    if (!groupedMessages[msg.project_id]) {
      groupedMessages[msg.project_id] = []
    }
    groupedMessages[msg.project_id].push(msg)
  })

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with Duke Studios about your projects
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Project Messages</CardTitle>
              <CardDescription>All conversations with Duke Studios</CardDescription>
            </CardHeader>
            <CardContent>
              {!messages || messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-center max-w-sm">
                    Start a conversation by sending a message to Duke Studios about your project.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedMessages).map(([projectId, projectMessages]) => {
                    const project = projects?.find((p) => p.id === projectId)
                    return (
                      <div key={projectId} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-border" />
                          <p className="text-sm font-medium text-muted-foreground">
                            {project?.title || 'Unknown Project'}
                          </p>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="space-y-4">
                          {projectMessages.map((message) => {
                            const isOwn = message.sender_id === user.id
                            return (
                              <div
                                key={message.id}
                                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {isOwn ? profile.name.charAt(0) : 'DS'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`flex-1 space-y-1 ${isOwn ? 'items-end' : ''}`}>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                      {isOwn ? 'You' : 'Duke Studios'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(message.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                  <div
                                    className={`rounded-lg p-3 max-w-md ${
                                      isOwn
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'bg-muted border border-border'
                                    }`}
                                  >
                                    <p className="text-sm">{message.message}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>Message Duke Studios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={6}
                  className="bg-background/50 border-border/50 resize-none"
                />
              </div>
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
