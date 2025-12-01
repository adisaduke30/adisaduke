import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { FolderKanban, Search, Calendar, ArrowRight } from 'lucide-react'

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

export default async function AdminProjectsPage() {
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

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      users!projects_client_id_fkey(name, email, company)
    `)
    .order('created_at', { ascending: false })

  const { data: clients } = await supabase
    .from('users')
    .select('id, name, email, company')
    .eq('role', 'client')
    .order('name', { ascending: true })

  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter((p) =>
    ['pre_production', 'shooting', 'editing', 'review'].includes(p.status)
  ).length || 0
  const deliveredProjects = projects?.filter((p) => p.status === 'delivered').length || 0

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage all client projects and deliverables
            </p>
          </div>
          <ProjectForm clients={clients || []} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                All projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <FolderKanban className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredProjects}</div>
              <p className="text-xs text-muted-foreground">
                Completed projects
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>View and manage client projects</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pre_production">Pre-Production</SelectItem>
                    <SelectItem value="shooting">Shooting</SelectItem>
                    <SelectItem value="editing">Editing</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-8 bg-background/50 border-border/50 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!projects || projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-center max-w-sm mb-6">
                  Create your first project to get started.
                </p>
                <ProjectForm clients={clients || []} />
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project: any) => (
                  <Link key={project.id} href={`/admin/projects/${project.id}`}>
                    <div className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {project.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={statusColors[project.status as keyof typeof statusColors]}
                            >
                              {statusLabels[project.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client: {project.users?.name || 'Unknown'}
                            {project.users?.company && ` (${project.users.company})`}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {project.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                        {project.project_type && (
                          <div className="text-sm">
                            Type: {project.project_type}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
