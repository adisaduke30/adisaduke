import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderKanban, Calendar, ArrowRight } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  pre_production: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shooting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  editing: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  review: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusLabels = {
  pending: 'Pending',
  pre_production: 'Pre-Production',
  shooting: 'Shooting',
  editing: 'Editing',
  review: 'In Review',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default async function ProjectsPage() {
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
    redirect('/admin/projects')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              View and manage your video production projects
            </p>
          </div>
          <Link href="/bookings">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Request New Project
            </Button>
          </Link>
        </div>

        {!projects || projects.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                You don&apos;t have any projects yet. Request a booking to get started.
              </p>
              <Link href="/bookings">
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Booking
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge
                        variant="outline"
                        className={statusColors[project.status as keyof typeof statusColors]}
                      >
                        {statusLabels[project.status as keyof typeof statusLabels]}
                      </Badge>
                      {project.shoot_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(project.shoot_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                      {project.budget && (
                        <div className="text-sm text-muted-foreground">
                          Budget: ${project.budget.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
