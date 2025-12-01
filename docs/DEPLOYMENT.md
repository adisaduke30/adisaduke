# Duke Studios - Production Deployment Guide

This guide walks through deploying Duke Studios to production on Vercel with all integrations configured.

## Prerequisites

Before deploying, ensure you have:
- A Vercel account
- A Supabase project (already set up)
- A Stripe account (for payments)
- A Resend account (for emails)
- Access to configure DNS (if using custom domain)

## Step 1: Prepare Your Repository

1. Ensure all code is committed to your Git repository
2. Push to your main branch on GitHub/GitLab/Bitbucket

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Initial Deployment

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Environment Variables

Add the following environment variables in Vercel:

#### Required Variables

```bash
# Supabase (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App URL (your Vercel deployment URL)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Stripe (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Resend (from Resend Dashboard)
RESEND_API_KEY=re_your_api_key
```

#### Optional Variables

```bash
# Admin User ID (set after first admin signup)
ADMIN_USER_ID=uuid_of_admin_user

# Google Calendar (if using calendar integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Sentry (for error tracking)
SENTRY_DSN=your_sentry_dsn
```

### Add Environment Variables via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add RESEND_API_KEY production
```

## Step 3: Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter webhook URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the signing secret
6. Add it to Vercel: `vercel env add STRIPE_WEBHOOK_SECRET production`

## Step 4: Configure Supabase

### Update Authentication URLs

In your Supabase project settings > Authentication > URL Configuration:

1. Site URL: `https://your-domain.vercel.app`
2. Redirect URLs: Add the following:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/login`
   - `https://your-domain.vercel.app/reset-password`
   - `https://your-domain.vercel.app/update-password`

### Enable Realtime

1. Go to Database > Replication
2. Enable realtime for these tables:
   - `notifications`
   - `project_messages`

### Email Templates

Configure email templates in Supabase Dashboard > Authentication > Email Templates:

- **Confirm signup**: Customize with Duke Studios branding
- **Reset password**: Customize with Duke Studios branding
- **Magic link**: Customize with Duke Studios branding

## Step 5: Configure Resend

### Verify Domain (Optional but Recommended)

1. Go to Resend Dashboard > Domains
2. Click "Add Domain"
3. Add your domain (e.g., `adisaduke.com`)
4. Add the provided DNS records to your DNS provider
5. Verify domain

### Update Email Configuration

If using a verified domain, update `lib/resend.ts`:

```typescript
export const emailConfig = {
  from: 'Duke Studios <noreply@adisaduke.com>',
  replyTo: 'adisaduke30@yahoo.com',
}
```

## Step 6: Configure Custom Domain (Optional)

1. In Vercel, go to your project > Settings > Domains
2. Add your custom domain (e.g., `adisaduke.com`)
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Step 7: Create Admin User

1. Navigate to your deployed site
2. Go to `/signup`
3. Create the first admin account
4. In Supabase Dashboard:
   - Go to Table Editor > users
   - Find your user
   - Update `role` to `admin`
   - Copy the user ID
5. Add to Vercel: `vercel env add ADMIN_USER_ID production`

## Step 8: Test All Integrations

### Authentication
- [ ] Sign up new user
- [ ] Email verification works
- [ ] Login works
- [ ] Password reset works
- [ ] Admin access works

### Bookings
- [ ] Client can create booking
- [ ] Admin receives notification
- [ ] Admin can approve/decline
- [ ] Client receives email notification

### Projects
- [ ] Admin can create project
- [ ] Client can view project
- [ ] Status updates work
- [ ] Email notifications sent

### Messages
- [ ] Client can send message
- [ ] Admin receives notification
- [ ] Real-time updates work
- [ ] Email notifications sent

### Files
- [ ] Admin can upload files
- [ ] Client can download files
- [ ] Final deliverable marking works
- [ ] Email notifications sent

### Invoices
- [ ] Admin can create invoice
- [ ] Stripe invoice created
- [ ] Client receives email
- [ ] Payment flow works
- [ ] Webhook updates status
- [ ] Payment confirmation email sent

### Notifications
- [ ] Real-time notifications work
- [ ] Notification center updates
- [ ] Mark as read works
- [ ] Delete works

## Step 9: Performance Optimization

### Enable Vercel Analytics (Optional)

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Enable Vercel Speed Insights (Optional)

```bash
npm install @vercel/speed-insights
```

## Step 10: Monitoring and Error Tracking

### Setup Sentry (Optional)

1. Create Sentry account
2. Create new Next.js project
3. Install Sentry:

```bash
npx @sentry/wizard@latest -i nextjs
```

4. Add DSN to Vercel environment variables

## Production Checklist

Before going live, verify:

### Security
- [ ] All API keys are in environment variables (not hardcoded)
- [ ] RLS policies are enabled on all Supabase tables
- [ ] CORS is properly configured
- [ ] Webhook signatures are verified
- [ ] Service role key is only used server-side

### Functionality
- [ ] All pages load without errors
- [ ] All forms submit successfully
- [ ] File uploads work
- [ ] File downloads work
- [ ] Payments process correctly
- [ ] Emails are delivered
- [ ] Real-time updates work

### Performance
- [ ] Images are optimized
- [ ] Build completes without warnings
- [ ] Lighthouse score > 90
- [ ] No console errors in production

### SEO & Meta
- [ ] Title tags are set
- [ ] Meta descriptions are set
- [ ] Open Graph images configured
- [ ] Favicon is set

### Legal
- [ ] Privacy policy is accessible
- [ ] Terms of service are accessible
- [ ] Cookie consent (if applicable)

## Deployment Commands

### Deploy to Production

```bash
vercel --prod
```

### Redeploy After Environment Variable Changes

```bash
vercel --prod --force
```

### View Logs

```bash
vercel logs your-deployment-url
```

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`

### Authentication Issues

1. Verify Supabase URL configuration
2. Check redirect URLs in Supabase
3. Verify environment variables

### Stripe Webhooks Not Working

1. Verify webhook URL is correct
2. Check webhook signing secret
3. Test webhook endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
4. Check Vercel function logs

### Email Not Sending

1. Verify Resend API key
2. Check domain verification
3. Test with Resend logs
4. Verify `from` email address

## Support

For issues:
- Check Vercel deployment logs
- Check Supabase logs
- Check Stripe dashboard logs
- Check Resend dashboard logs

---

**Deployment Date**: _____________
**Deployed By**: Luis Disla
**Production URL**: _____________

**Zorath LLC** | Duke Studios
