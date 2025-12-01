'use client'

import { useState } from 'react'
import { createCheckoutSession, getInvoicePaymentUrl } from '@/app/actions/invoices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  DollarSign,
  Calendar,
  Download,
  ExternalLink,
  CreditCard,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paid: 'bg-green-500/10 text-green-500 border-green-500/20',
  partial: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  partial: 'Partially Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

const statusIcons = {
  draft: Clock,
  sent: FileText,
  paid: CheckCircle2,
  partial: DollarSign,
  overdue: Clock,
  cancelled: XCircle,
}

interface LineItem {
  description: string
  quantity: number
  unit_price: number
}

interface InvoiceDetailClientProps {
  invoice: {
    id: string
    invoice_number: string
    amount: number
    deposit_amount: number | null
    status: string
    due_date: string | null
    created_at: string
    line_items: LineItem[]
    notes: string | null
    stripe_invoice_id: string
    projects: {
      name: string
    }
  }
  showPaymentSuccess?: boolean
}

export function InvoiceDetailClient({ invoice, showPaymentSuccess }: InvoiceDetailClientProps) {
  const { toast } = useToast()
  const [payingFull, setPayingFull] = useState(false)
  const [payingDeposit, setPayingDeposit] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [viewingHosted, setViewingHosted] = useState(false)

  const subtotal = invoice.amount / 100
  const depositAmount = invoice.deposit_amount ? invoice.deposit_amount / 100 : null
  const StatusIcon = statusIcons[invoice.status as keyof typeof statusIcons] || FileText

  const handlePayment = async (isDeposit: boolean = false) => {
    if (isDeposit) {
      setPayingDeposit(true)
    } else {
      setPayingFull(true)
    }

    try {
      const result = await createCheckoutSession(invoice.id, isDeposit)

      if (result.success && result.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.url
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create checkout session',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      })
    } finally {
      setPayingFull(false)
      setPayingDeposit(false)
    }
  }

  const handleViewHosted = async () => {
    setViewingHosted(true)
    try {
      const result = await getInvoicePaymentUrl(invoice.id)

      if (result.success && result.data?.hosted_invoice_url) {
        window.open(result.data.hosted_invoice_url, '_blank')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to get invoice URL',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('View hosted error:', error)
      toast({
        title: 'Error',
        description: 'Failed to open invoice',
        variant: 'destructive',
      })
    } finally {
      setViewingHosted(false)
    }
  }

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const result = await getInvoicePaymentUrl(invoice.id)

      if (result.success && result.data?.invoice_pdf) {
        window.open(result.data.invoice_pdf, '_blank')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to get PDF',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Download PDF error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        variant: 'destructive',
      })
    } finally {
      setDownloadingPdf(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground">{invoice.projects.name}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${statusColors[invoice.status as keyof typeof statusColors]} flex items-center gap-1.5 px-3 py-1.5`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusLabels[invoice.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      {/* Payment Success Message */}
      {showPaymentSuccess && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-green-500">Payment Successful</p>
              <p className="text-sm text-muted-foreground">Your payment has been processed. The invoice will be updated shortly.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Invoice Details */}
        <Card className="md:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Breakdown of charges and line items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Line Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Line Items</h3>
              <div className="space-y-2">
                {invoice.line_items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-accent/20 border border-border/50">
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} x ${(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.quantity * item.unit_price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {depositAmount && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deposit Amount</span>
                  <span className="font-medium text-primary">${depositAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Total Due</span>
                <span className="font-bold text-2xl">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions & Info */}
        <div className="space-y-6">
          {/* Payment Actions */}
          {invoice.status === 'sent' && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Payment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => handlePayment(false)}
                  disabled={payingFull || payingDeposit}
                >
                  {payingFull ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Full Amount (${subtotal.toFixed(2)})
                    </>
                  )}
                </Button>

                {depositAmount && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handlePayment(true)}
                    disabled={payingFull || payingDeposit}
                  >
                    {payingDeposit ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pay Deposit (${depositAmount.toFixed(2)})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invoice Info */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Issued:</span>
                </div>
                <p className="font-medium ml-6">
                  {new Date(invoice.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {invoice.due_date && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due Date:</span>
                  </div>
                  <p className="font-medium ml-6">
                    {new Date(invoice.due_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleViewHosted}
                  disabled={viewingHosted}
                >
                  {viewingHosted ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  View Invoice
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                >
                  {downloadingPdf ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
