'use server'

import { Resend } from 'resend'
import { ContactEmail } from '@/emails/ContactEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { name, email, message } = data

    // Send email to admin
    await resend.emails.send({
      from: 'Duke Studios <noreply@dukestudios.com>',
      to: process.env.ADMIN_EMAIL || 'adisaduke30@yahoo.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      react: ContactEmail({ name, email, message }),
    })

    console.log('Contact form email sent successfully:', { name, email })

    return { success: true }
  } catch (error) {
    console.error('Error sending contact form email:', error)
    return {
      success: false,
      error: 'Failed to send contact form email',
    }
  }
}
