import { Resend } from 'resend'

// Check if Resend key is configured
const resendKey = process.env.RESEND_API_KEY

if (!resendKey || resendKey.includes('your_resend')) {
  console.warn('Warning: Resend is not configured. Set RESEND_API_KEY in .env.local')
}

// Initialize with a dummy key if not set (allows build to succeed)
export const resend = new Resend(resendKey || 're_dummy_key_for_build')

// Email sender configuration
export const emailConfig = {
  from: 'Duke Studios <noreply@adisaduke.com>',
  replyTo: 'adisaduke30@yahoo.com',
}
