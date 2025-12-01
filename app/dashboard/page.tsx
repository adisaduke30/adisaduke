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

  const stats = [
    {
      title: 'Active Projects',
      value: '0',
      icon: FolderKanban,
      description: 'Projects in progress',
    },
    {
      title: 'Messages',
      value: '0',
      icon: MessageSquare,
      description: 'Unread messages',
    },
    {
      title: 'Invoices',
      value: '0',
      icon: FileText,
      description: 'Pending invoices',
    },
    {
      title: 'Bookings',
      value: '0',
      icon: Calendar,
      description: 'Upcoming bookings',
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

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent project updates and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
