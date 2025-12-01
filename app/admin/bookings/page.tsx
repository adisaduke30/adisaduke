import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { BookingActions } from '@/components/admin/BookingActions'
import { Calendar, DollarSign, MapPin, Check, X, Clock } from 'lucide-react'

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

export default async function AdminBookingsPage() {
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

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      users!bookings_client_id_fkey(name, email, company, avatar_url)
    `)
    .order('created_at', { ascending: false })

  const pendingCount = bookings?.filter((b) => b.status === 'pending').length || 0
  const approvedCount = bookings?.filter((b) => b.status === 'approved').length || 0
  const declinedCount = bookings?.filter((b) => b.status === 'declined').length || 0

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Review and manage booking requests from clients
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">
                Converted to projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declined</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{declinedCount}</div>
              <p className="text-xs text-muted-foreground">
                Not accepted
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {!bookings || bookings.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
                <p className="text-center max-w-sm">
                  Booking requests from clients will appear here for review.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {pendingCount > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                  </div>
                  <div className="grid gap-4">
                    {bookings
                      .filter((b) => b.status === 'pending')
                      .map((booking: any) => {
                        const initials = booking.users?.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase() || '??'

                        return (
                          <Card key={booking.id} className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="mb-1">{booking.project_type || 'Project Request'}</CardTitle>
                                    <CardDescription>
                                      {booking.users?.name}
                                      {booking.users?.company && ` from ${booking.users.company}`}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={statusColors[booking.status as keyof typeof statusColors]}
                                >
                                  {statusLabels[booking.status as keyof typeof statusLabels]}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-muted-foreground">{booking.message}</p>
                              <Separator />
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {booking.desired_date && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Requested Date</p>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      {new Date(booking.desired_date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </div>
                                  </div>
                                )}
                                {booking.budget_range && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      {booking.budget_range}
                                    </div>
                                  </div>
                                )}
                                {booking.location && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      {booking.location}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Separator />
                              <BookingActions bookingId={booking.id} />
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </>
              )}

              {(approvedCount > 0 || declinedCount > 0) && (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Past Requests</h2>
                  </div>
                  <div className="grid gap-4">
                    {bookings
                      .filter((b) => b.status !== 'pending')
                      .map((booking: any) => {
                        const initials = booking.users?.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase() || '??'

                        return (
                          <Card key={booking.id} className="border-border/50 bg-card/50 backdrop-blur opacity-75">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base">{booking.project_type || 'Project Request'}</CardTitle>
                                    <CardDescription className="text-sm">
                                      {booking.users?.name}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={statusColors[booking.status as keyof typeof statusColors]}
                                >
                                  {statusLabels[booking.status as keyof typeof statusLabels]}
                                </Badge>
                              </div>
                            </CardHeader>
                          </Card>
                        )
                      })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
