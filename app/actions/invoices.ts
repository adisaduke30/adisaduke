'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendNewInvoiceEmail, sendPaymentReceivedEmail } from '@/lib/email/send'

// Validation schemas
const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Price must be positive'),
})

const invoiceSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  line_items: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  deposit_percentage: z.number().min(0).max(100).optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

export async function createInvoice(formData: InvoiceFormData) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Validate input
    const validatedData = invoiceSchema.parse(formData)

    // Get project and client info
    const { data: project } = await supabase
      .from('projects')
      .select(`
        *,
        users!projects_client_id_fkey(id, email, name, stripe_customer_id)
      `)
      .eq('id', validatedData.project_id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const client = project.users as any

    // Calculate total amount
    const totalAmount = validatedData.line_items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    )

    const depositAmount = validatedData.deposit_percentage
      ? (totalAmount * validatedData.deposit_percentage) / 100
      : 0

    // Create or get Stripe customer
    let customerId = client.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        metadata: {
          supabase_user_id: client.id,
        },
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', client.id)
    }

    // Create Stripe invoice
    const stripeInvoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: validatedData.due_date
        ? Math.ceil((new Date(validatedData.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 30,
      metadata: {
        project_id: validatedData.project_id,
        project_name: project.name,
        deposit_percentage: validatedData.deposit_percentage?.toString() || '0',
      },
      description: `Invoice for ${project.name}`,
    })

    // Add line items to Stripe invoice
    for (const item of validatedData.line_items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: stripeInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_amount: formatAmountForStripe(item.unit_price),
      })
    }

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id)

    // Insert invoice record in database
    const { data: invoiceRecord, error } = await supabase
      .from('invoices')
      .insert({
        project_id: validatedData.project_id,
        stripe_invoice_id: finalizedInvoice.id,
        amount: formatAmountForStripe(totalAmount),
        deposit_amount: depositAmount ? formatAmountForStripe(depositAmount) : null,
        status: 'sent',
        due_date: validatedData.due_date || null,
        line_items: validatedData.line_items,
        notes: validatedData.notes,
      })
      .select()
      .single()

    if (error) {
      console.error('Invoice database error:', error)
      // Try to void the Stripe invoice if database insert fails
      await stripe.invoices.voidInvoice(finalizedInvoice.id)
      return { success: false, error: 'Failed to create invoice record' }
    }

    // Send the invoice via Stripe
    await stripe.invoices.sendInvoice(finalizedInvoice.id)

    // Create notification for client
    await supabase.from('notifications').insert({
      user_id: client.id,
      type: 'invoice_sent',
      title: 'New Invoice',
      message: `You have a new invoice for ${project.name} - $${totalAmount.toFixed(2)}`,
      link: `/invoices/${invoiceRecord.id}`,
    })

    // Send email notification
    const dueDateFormatted = validatedData.due_date
      ? new Date(validatedData.due_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Upon receipt'

    await sendNewInvoiceEmail(
      client.email,
      client.name,
      invoiceRecord.id,
      invoiceRecord.invoice_number,
      invoiceRecord.amount,
      dueDateFormatted,
      project.name
    )

    // Revalidate
    revalidatePath('/admin/invoices')
    revalidatePath(`/admin/projects/${validatedData.project_id}`)
    revalidatePath('/invoices')

    return { success: true, data: { invoice: invoiceRecord, stripeInvoice: finalizedInvoice } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getInvoicePaymentUrl(invoiceId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get invoice
    const { data: invoice } = await supabase
      .from('invoices')
      .select(`
        *,
        projects!inner(client_id, name)
      `)
      .eq('id', invoiceId)
      .single()

    if (!invoice) {
      return { success: false, error: 'Invoice not found' }
    }

    const project = invoice.projects as any

    // Check access (admin or client)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get Stripe invoice
    const stripeInvoice = await stripe.invoices.retrieve(invoice.stripe_invoice_id)

    return {
      success: true,
      data: {
        hosted_invoice_url: stripeInvoice.hosted_invoice_url,
        invoice_pdf: stripeInvoice.invoice_pdf,
      },
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function createCheckoutSession(invoiceId: string, isDeposit: boolean = false) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get invoice with project and client info
    const { data: invoice } = await supabase
      .from('invoices')
      .select(`
        *,
        projects!inner(
          client_id,
          name,
          users!projects_client_id_fkey(id, email, name, stripe_customer_id)
        )
      `)
      .eq('id', invoiceId)
      .single()

    if (!invoice) {
      return { success: false, error: 'Invoice not found' }
    }

    const project = invoice.projects as any
    const client = project.users

    // Check if user is the client
    if (client.id !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Calculate amount
    const amount = isDeposit && invoice.deposit_amount
      ? invoice.deposit_amount
      : invoice.amount

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: client.stripe_customer_id,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isDeposit ? `Deposit for ${project.name}` : `Invoice for ${project.name}`,
              description: `Duke Studios - ${project.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoice_id: invoiceId,
        project_id: invoice.project_id,
        is_deposit: isDeposit.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoiceId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoiceId}?payment=cancelled`,
    })

    return { success: true, data: { url: session.url } }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function voidInvoice(invoiceId: string) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Get invoice
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (!invoice) {
      return { success: false, error: 'Invoice not found' }
    }

    // Void in Stripe
    await stripe.invoices.voidInvoice(invoice.stripe_invoice_id)

    // Update database
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'cancelled' })
      .eq('id', invoiceId)

    if (error) {
      console.error('Invoice update error:', error)
      return { success: false, error: 'Failed to update invoice' }
    }

    // Revalidate
    revalidatePath('/admin/invoices')
    revalidatePath(`/admin/projects/${invoice.project_id}`)
    revalidatePath('/invoices')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
