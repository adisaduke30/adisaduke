import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderKanban, DollarSign, Calendar } from 'lucide-react'

export default async function AdminDashboardPage() {
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

  if (profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Query total clients count
  const { count: totalClientsCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  // Query active projects count
  const { count: activeProjectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pre_production', 'shooting', 'editing', 'review'])

  // Query revenue this month (paid invoices)
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { data: paidInvoices } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', startOfMonth)

  const totalRevenue = paidInvoices?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

  // Query pending bookings count
  const { count: pendingBookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Query recent projects with client info
  const { data: recentProjects } = await supabase
    .from('projects')
    .select(`
      *,
      users!projects_client_id_fkey(name, email, company)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Query pending bookings for approval
  const { data: pendingBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      title: 'Total Clients',
      value: totalClientsCount?.toString() || '0',
      icon: Users,
      description: 'Active clients',
    },
    {
      title: 'Active Projects',
      value: activeProjectsCount?.toString() || '0',
      icon: FolderKanban,
      description: 'In progress',
    },
    {
      title: 'Revenue',
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      icon: DollarSign,
      description: 'This month',
    },
    {
      title: 'Pending Bookings',
      value: pendingBookingsCount?.toString() || '0',
      icon: Calendar,
      description: 'Awaiting approval',
    },
  ]

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Studio overview and management
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest client projects</CardDescription>
            </CardHeader>
            <CardContent>
              {!recentProjects || recentProjects.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No projects yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project: any) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderKanban className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.users?.name || 'Unknown Client'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {project.status.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Booking requests waiting for review</CardDescription>
            </CardHeader>
            <CardContent>
              {!pendingBookings || pendingBookings.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No pending approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{booking.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.project_type || 'No type specified'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.desired_date).toLocaleDateString()}
                      </p>
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
