import { resend, emailConfig } from '@/lib/resend'
import { render } from '@react-email/components'
import * as templates from './templates'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://duke-studios.vercel.app'

// Helper to send email with error handling
async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_resend')) {
      console.log('Email not sent (Resend not configured):', { to, subject })
      return { success: false, error: 'Email service not configured' }
    }

    const result = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', { to, subject, id: result.data?.id })
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Welcome email with verification link
export async function sendWelcomeEmail(to: string, name: string, verifyUrl: string) {
  const html = await render(templates.WelcomeEmail({ name, verifyUrl }))
  return sendEmail(to, 'Welcome to Duke Studios', html)
}

// Booking confirmed email
export async function sendBookingConfirmedEmail(
  to: string,
  name: string,
  bookingId: string,
  date: string,
  time: string,
  type: string
) {
  const bookingUrl = `${baseUrl}/bookings`
  const html = await render(
    templates.BookingConfirmedEmail({ name, date, time, type, bookingUrl })
  )
  return sendEmail(to, 'Booking Confirmed - Duke Studios', html)
}

// Booking declined email
export async function sendBookingDeclinedEmail(
  to: string,
  name: string,
  date: string,
  time: string,
  type: string,
  reason?: string
) {
  const html = await render(
    templates.BookingDeclinedEmail({ name, date, time, type, reason })
  )
  return sendEmail(to, 'Booking Request Update - Duke Studios', html)
}

// New invoice email
export async function sendNewInvoiceEmail(
  to: string,
  name: string,
  invoiceId: string,
  invoiceNumber: string,
  amount: number,
  dueDate: string,
  projectName: string
) {
  const invoiceUrl = `${baseUrl}/invoices/${invoiceId}`
  const amountFormatted = `$${(amount / 100).toFixed(2)}`
  const html = await render(
    templates.NewInvoiceEmail({
      name,
      invoiceNumber,
      amount: amountFormatted,
      dueDate,
      projectName,
      invoiceUrl,
    })
  )
  return sendEmail(to, `New Invoice ${invoiceNumber} - Duke Studios`, html)
}

// Payment received email
export async function sendPaymentReceivedEmail(
  to: string,
  name: string,
  invoiceId: string,
  invoiceNumber: string,
  amount: number,
  projectName: string,
  isDeposit: boolean = false
) {
  const invoiceUrl = `${baseUrl}/invoices/${invoiceId}`
  const amountFormatted = `$${(amount / 100).toFixed(2)}`
  const html = await render(
    templates.PaymentReceivedEmail({
      name,
      amount: amountFormatted,
      invoiceNumber,
      projectName,
      isDeposit,
      invoiceUrl,
    })
  )
  return sendEmail(to, `Payment Received - ${amountFormatted}`, html)
}

// New message email
export async function sendNewMessageEmail(
  to: string,
  name: string,
  senderName: string,
  messagePreview: string,
  projectId: string,
  projectName: string
) {
  const messageUrl = `${baseUrl}/projects/${projectId}?tab=messages`
  const html = await render(
    templates.NewMessageEmail({
      name,
      senderName,
      messagePreview,
      projectName,
      messageUrl,
    })
  )
  return sendEmail(to, `New Message from ${senderName} - Duke Studios`, html)
}

// Project status update email
export async function sendProjectStatusEmail(
  to: string,
  name: string,
  projectId: string,
  projectName: string,
  oldStatus: string,
  newStatus: string
) {
  const projectUrl = `${baseUrl}/projects/${projectId}`
  const html = await render(
    templates.ProjectStatusEmail({
      name,
      projectName,
      oldStatus,
      newStatus,
      projectUrl,
    })
  )
  return sendEmail(to, `Project Update: ${projectName} - Duke Studios`, html)
}

// New file uploaded email
export async function sendNewFileEmail(
  to: string,
  name: string,
  projectId: string,
  projectName: string,
  fileName: string,
  isFinal: boolean = false
) {
  const projectUrl = `${baseUrl}/projects/${projectId}?tab=files`
  const html = await render(
    templates.NewFileEmail({
      name,
      projectName,
      fileName,
      isFinal,
      projectUrl,
    })
  )
  const subject = isFinal
    ? `Final Deliverable Ready: ${projectName} - Duke Studios`
    : `New File Uploaded: ${projectName} - Duke Studios`
  return sendEmail(to, subject, html)
}

// Password reset email
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const html = await render(templates.PasswordResetEmail({ name, resetUrl }))
  return sendEmail(to, 'Reset Your Password - Duke Studios', html)
}
