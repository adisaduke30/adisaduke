import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, MessageSquare, FileText, Calendar } from 'lucide-react'

export default async function DashboardPage() {
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
    redirect('/admin/dashboard')
  }

  // Query active projects count
  const { count: activeProjectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', user.id)
    .in('status', ['pre_production', 'shooting', 'editing', 'review'])

  // Get project IDs for this client
  const { data: clientProjects } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', user.id)

  const projectIds = clientProjects?.map(p => p.id) || []

  // Query unread messages count
  const { count: unreadMessagesCount } = projectIds.length > 0 ? await supabase
    .from('project_messages')
    .select('*', { count: 'exact', head: true })
    .neq('sender_id', user.id)
    .is('read_at', null)
    .in('project_id', projectIds)
    : { count: 0 }

  // Query pending invoices count
  const { count: pendingInvoicesCount } = projectIds.length > 0 ? await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .in('project_id', projectIds)
    .in('status', ['draft', 'sent', 'overdue'])
    : { count: 0 }

  // Query pending bookings count
  const { count: pendingBookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', user.id)
    .eq('status', 'pending')

  // Query recent projects
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  // Query recent messages
  const { data: recentMessages } = await supabase
    .from('project_messages')
    .select(`
      *,
      projects!inner(name, client_id)
    `)
    .eq('projects.client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjectsCount?.toString() || '0',
      icon: FolderKanban,
      description: 'Projects in progress',
    },
    {
      title: 'Messages',
      value: unreadMessagesCount?.toString() || '0',
      icon: MessageSquare,
      description: 'Unread messages',
    },
    {
      title: 'Invoices',
      value: pendingInvoicesCount?.toString() || '0',
      icon: FileText,
      description: 'Pending invoices',
    },
    {
      title: 'Bookings',
      value: pendingBookingsCount?.toString() || '0',
      icon: Calendar,
      description: 'Pending bookings',
    },
  ]

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest projects</CardDescription>
            </CardHeader>
            <CardContent>
              {!recentProjects || recentProjects.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No projects yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderKanban className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {project.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest communications</CardDescription>
            </CardHeader>
            <CardContent>
              {!recentMessages || recentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((message: any) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message.projects.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{message.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
