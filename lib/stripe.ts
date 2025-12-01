import Stripe from 'stripe'

// Check if Stripe key is configured (allow build without it)
const stripeKey = process.env.STRIPE_SECRET_KEY

if (!stripeKey || stripeKey.includes('your_stripe')) {
  console.warn('⚠️  Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local')
  console.warn('📖 See docs/STRIPE_SETUP.md for setup instructions')
}

// Initialize with a dummy key if not set (allows build to succeed)
export const stripe = new Stripe(stripeKey || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const formatAmountForStripe = (amount: number): number => {
  // Convert dollars to cents
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number): number => {
  // Convert cents to dollars
  return amount / 100
}
