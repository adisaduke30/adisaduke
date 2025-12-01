import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, DollarSign, Search, Plus, Calendar } from 'lucide-react'

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paid: 'bg-green-500/10 text-green-500 border-green-500/20',
  overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

export default async function AdminInvoicesPage() {
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

  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      projects(title),
      users!invoices_client_id_fkey(name, company)
    `)
    .order('created_at', { ascending: false })

  const totalRevenue = invoices?.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0
  const pendingAmount = invoices?.filter((inv) => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0) || 0
  const overdueAmount = invoices?.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0) || 0

  return (
    <DashboardLayout user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">
              Manage client invoices and payments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Paid invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overdueAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Past due date
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>View and manage client invoices</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40 bg-background/50 border-border/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Invoices</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-8 bg-background/50 border-border/50 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!invoices || invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                <p className="text-center max-w-sm mb-6">
                  Create your first invoice to start billing clients.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{invoice.invoice_number}</p>
                          <Badge
                            variant="outline"
                            className={statusColors[invoice.status as keyof typeof statusColors]}
                          >
                            {statusLabels[invoice.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{invoice.users?.name || 'Unknown Client'}</span>
                          {invoice.users?.company && (
                            <>
                              <span>•</span>
                              <span>{invoice.users.company}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{invoice.projects?.title || 'No Project'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-lg">${invoice.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(invoice.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
