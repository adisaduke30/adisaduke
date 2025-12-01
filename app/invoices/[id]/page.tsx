import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout'
import { InvoiceDetailClient } from '@/components/invoices/InvoiceDetailClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    payment?: string
  }>
}

export default async function InvoiceDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { payment } = await searchParams

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

  if (!profile) {
    redirect('/login')
  }

  // Get invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      projects!inner(name, client_id)
    `)
    .eq('id', id)
    .single()

  if (invoiceError || !invoice) {
    redirect('/invoices')
  }

  // Check access
  if (invoice.projects.client_id !== user.id && profile.role !== 'admin') {
    redirect('/invoices')
  }

  const showPaymentSuccess = payment === 'success'

  return (
    <DashboardLayout user={profile}>
      <InvoiceDetailClient invoice={invoice} showPaymentSuccess={showPaymentSuccess} />
    </DashboardLayout>
  )
}
