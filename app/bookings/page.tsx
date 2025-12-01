import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookingForm } from '@/components/forms/BookingForm'
import { Calendar, Clock, DollarSign } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  declined: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const statusLabels = {
  pending: 'Pending Review',
  approved: 'Approved',
  declined: 'Declined',
}

export default async function BookingsPage() {
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
    redirect('/admin/bookings')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">
              Request and manage your project bookings
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Your Booking Requests</CardTitle>
              <CardDescription>Track the status of your project requests</CardDescription>
            </CardHeader>
            <CardContent>
              {!bookings || bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-center max-w-sm mb-6">
                    You haven&apos;t made any booking requests. Create one to start a new project with Duke Studios.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{booking.project_type || 'Project Request'}</h3>
                            <Badge
                              variant="outline"
                              className={statusColors[booking.status as keyof typeof statusColors]}
                            >
                              {statusLabels[booking.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {booking.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {booking.desired_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.desired_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                        {booking.budget_range && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {booking.budget_range}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Requested {new Date(booking.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>New Booking Request</CardTitle>
              <CardDescription>Request a new project with Duke Studios</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm userEmail={profile.email} userName={profile.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
