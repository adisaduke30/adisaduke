import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { sendPaymentReceivedEmail } from '@/lib/email/send'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Stripe webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  const supabase = await createClient()
  const metadata = session.metadata

  if (!metadata?.invoice_id) {
    console.error('No invoice_id in metadata')
    return
  }

  const isDeposit = metadata.is_deposit === 'true'

  // Get invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      projects!inner(name, client_id, users!projects_client_id_fkey(id, name, email))
    `)
    .eq('id', metadata.invoice_id)
    .single()

  if (invoiceError || !invoice) {
    console.error('Invoice not found:', metadata.invoice_id)
    return
  }

  const project = invoice.projects as any
  const client = project.users

  // Update invoice status
  let newStatus = 'paid'
  if (isDeposit && invoice.deposit_amount) {
    newStatus = 'partial'
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ status: newStatus })
    .eq('id', metadata.invoice_id)

  if (updateError) {
    console.error('Failed to update invoice:', updateError)
    return
  }

  // Create notification
  const paymentType = isDeposit ? 'deposit' : 'full payment'
  const amount = isDeposit ? invoice.deposit_amount! / 100 : invoice.amount / 100

  await supabase.from('notifications').insert({
    user_id: client.id,
    type: 'payment_received',
    title: `Payment Received - ${project.name}`,
    message: `Your ${paymentType} of $${amount.toFixed(2)} has been processed successfully.`,
    link: `/invoices/${metadata.invoice_id}`,
  })

  // Send payment confirmation email
  await sendPaymentReceivedEmail(
    client.email,
    client.name,
    metadata.invoice_id,
    invoice.invoice_number,
    isDeposit ? invoice.deposit_amount! : invoice.amount,
    project.name,
    isDeposit
  )

  console.log(`Invoice ${metadata.invoice_id} marked as ${newStatus}`)
}

async function handleInvoicePaid(stripeInvoice: Stripe.Invoice) {
  console.log('Invoice paid:', stripeInvoice.id)

  const supabase = await createClient()

  // Find invoice by Stripe invoice ID
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      projects!inner(name, client_id, users!projects_client_id_fkey(id, name, email))
    `)
    .eq('stripe_invoice_id', stripeInvoice.id)
    .single()

  if (invoiceError || !invoice) {
    console.error('Invoice not found for Stripe invoice:', stripeInvoice.id)
    return
  }

  const project = invoice.projects as any
  const client = project.users

  // Update invoice status
  const { error: updateError } = await supabase
    .from('invoices')
    .update({ status: 'paid' })
    .eq('id', invoice.id)

  if (updateError) {
    console.error('Failed to update invoice:', updateError)
    return
  }

  // Create notification
  await supabase.from('notifications').insert({
    user_id: client.id,
    type: 'payment_received',
    title: `Invoice Paid - ${project.name}`,
    message: `Your invoice ${invoice.invoice_number} has been paid in full.`,
    link: `/invoices/${invoice.id}`,
  })

  console.log(`Invoice ${invoice.id} marked as paid`)
}

async function handleInvoicePaymentFailed(stripeInvoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', stripeInvoice.id)

  const supabase = await createClient()

  // Find invoice by Stripe invoice ID
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      projects!inner(name, client_id, users!projects_client_id_fkey(id, name, email))
    `)
    .eq('stripe_invoice_id', stripeInvoice.id)
    .single()

  if (invoiceError || !invoice) {
    console.error('Invoice not found for Stripe invoice:', stripeInvoice.id)
    return
  }

  const project = invoice.projects as any
  const client = project.users

  // Update invoice status to overdue if it was sent
  if (invoice.status === 'sent') {
    await supabase
      .from('invoices')
      .update({ status: 'overdue' })
      .eq('id', invoice.id)
  }

  // Create notification
  await supabase.from('notifications').insert({
    user_id: client.id,
    type: 'payment_failed',
    title: `Payment Failed - ${project.name}`,
    message: `Your payment for invoice ${invoice.invoice_number} could not be processed. Please update your payment method.`,
    link: `/invoices/${invoice.id}`,
  })

  console.log(`Invoice ${invoice.id} payment failed`)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id)
  // Additional handling if needed
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id)
  // Additional handling if needed
}
