# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe for Duke Studios payment processing.

## Step 1: Create a Stripe Account

1. Go to https://stripe.com
2. Click "Sign up" and create an account
3. Complete your business profile

## Step 2: Get Your API Keys

### For Development (Test Mode)

1. Log in to your Stripe Dashboard
2. Make sure you're in **Test Mode** (toggle in the top-right)
3. Go to **Developers > API keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Update Your .env.local File

Replace the placeholder values in `.env.local`:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # We'll get this in Step 4
```

## Step 3: Test Cards for Development

Use these test card numbers in development:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Payment declined |

- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any valid ZIP code (e.g., 12345)

## Step 4: Set Up Webhooks (Local Development)

For local development, you'll use the Stripe CLI:

### Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
Download from https://github.com/stripe/stripe-cli/releases

**Linux:**
```bash
# Download and install from releases page
```

### Login to Stripe CLI
```bash
stripe login
```

### Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will output a webhook signing secret (starts with `whsec_`). Copy this to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### Keep the Stripe CLI Running

While developing, keep the `stripe listen` command running in a separate terminal window.

## Step 5: Set Up Webhooks (Production)

For production deployment on Vercel:

1. Go to Stripe Dashboard > **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://your-domain.vercel.app/api/stripe/webhook
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Vercel environment variables:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   ```

## Step 6: Go Live (Production)

When you're ready for production:

1. Complete Stripe account activation (provide business details, banking info)
2. Switch to **Live Mode** in Stripe Dashboard
3. Get your live API keys from **Developers > API keys**:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)
4. Update Vercel environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
   vercel env add STRIPE_SECRET_KEY production
   ```

## Step 7: Verify Installation

After setting up your keys, restart your development server:

```bash
npm run dev
```

The application should now be able to:
- Create invoices
- Generate Stripe Checkout sessions
- Process payments
- Handle webhooks

## Troubleshooting

### "STRIPE_SECRET_KEY is not set"
- Make sure you've updated `.env.local` with your actual keys
- Restart your development server after changing environment variables

### Webhooks Not Working Locally
- Make sure the Stripe CLI is running (`stripe listen`)
- Verify the webhook secret in `.env.local` matches the CLI output
- Check that your app is running on port 3000

### Payments Failing in Test Mode
- Use the test card numbers provided above
- Make sure you're in Test Mode in Stripe Dashboard
- Check Stripe Dashboard > Logs for error details

## Next Steps

Once Stripe is configured:
1. Create your first invoice through the admin interface
2. Test the payment flow with test cards
3. Verify webhook events are being received
4. Check payment status updates in the database

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Duke Studios: Contact your development team

---

**Last Updated:** December 2025
**Zorath LLC** | Duke Studios Development
