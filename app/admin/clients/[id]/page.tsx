import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Phone, Building, Calendar, DollarSign, FolderKanban, FileText } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get client details
  const { data: client } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) {
    redirect('/admin/clients')
  }

  // Get client's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  // Get client's invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      projects!inner(client_id, name)
    `)
    .eq('projects.client_id', id)
    .order('created_at', { ascending: false })

  // Get client's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter(p => !['delivered', 'cancelled'].includes(p.status)).length || 0
  const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount / 100), 0) || 0
  const pendingInvoices = invoices?.filter(i => i.status === 'sent').length || 0

  const statusColors = {
    draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    partial: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }

  const projectStatusColors = {
    pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    pre_production: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    shooting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    editing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    review: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <p className="text-muted-foreground">Client since {new Date(client.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {client.role}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From paid invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total requests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>

            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
              </div>
            )}

            {client.company && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(client.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects ({totalProjects})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices?.length || 0})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {!projects || projects.length === 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mb-4" />
                  <p>No projects yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Link key={project.id} href={`/admin/projects/${project.id}`}>
                    <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              variant="outline"
                              className={projectStatusColors[project.status as keyof typeof projectStatusColors]}
                            >
                              {project.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {project.deadline && `Due ${new Date(project.deadline).toLocaleDateString()}`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            {!invoices || invoices.length === 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4" />
                  <p>No invoices yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="border-border/50 bg-card/50 backdrop-blur">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{invoice.invoice_number}</h3>
                          <Badge
                            variant="outline"
                            className={statusColors[invoice.status as keyof typeof statusColors]}
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.projects.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${(invoice.amount / 100).toFixed(2)}</p>
                        {invoice.due_date && (
                          <p className="text-sm text-muted-foreground">
                            Due {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {!bookings || bookings.length === 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-4" />
                  <p>No bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="border-border/50 bg-card/50 backdrop-blur">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline">
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.desired_date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {booking.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
