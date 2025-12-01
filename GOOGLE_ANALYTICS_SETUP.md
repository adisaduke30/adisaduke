# Google Analytics 4 Setup Guide

**Status**: Code implemented, awaiting GA property creation
**Updated**: December 1, 2025

---

## Overview

Google Analytics 4 (GA4) tracking has been integrated into the Duke Studios platform. You just need to create a GA4 property and add the tracking ID to your environment variables.

---

## Step 1: Create Google Analytics 4 Property

### 1. Go to Google Analytics
Visit: https://analytics.google.com

### 2. Create Account (if needed)
- Click "Start measuring"
- Account name: "Duke Studios"
- Data sharing settings: Choose preferences
- Click "Next"

### 3. Create Property
- Property name: "Duke Studios - Adisa Duke"
- Reporting time zone: Your timezone
- Currency: USD
- Click "Next"

### 4. Business Information
- Industry category: "Arts & Entertainment" or "Professional Services"
- Business size: "Small" (1-10 employees)
- How you plan to use Analytics: Check relevant boxes
- Click "Create"

### 5. Accept Terms of Service
- Click "I Accept"

### 6. Set Up Data Stream
- Platform: **Web**
- Website URL: `https://adisaduke.vercel.app`
- Stream name: "Duke Studios Website"
- Click "Create stream"

### 7. Get Measurement ID
After creating the stream, you'll see:
- **Measurement ID**: `G-XXXXXXXXXX` (looks like G- followed by 10 characters)
- **Copy this ID** - you'll need it for the next step

---

## Step 2: Add Tracking ID to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your `adisaduke` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environments**: Check all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your site for changes to take effect

### Method 2: Via .env.local (Local Development)

1. In your project root, edit `.env.local`
2. Add this line:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID
4. Restart dev server: `npm run dev`

---

## Step 3: Verify Installation

### Check in Google Analytics (Takes 24-48 hours)

1. Go to Google Analytics
2. Navigate to: **Reports** → **Realtime**
3. Open your site in a new tab: https://adisaduke.vercel.app
4. Navigate through a few pages
5. Within 30 seconds, you should see activity in Realtime report

### Check in Browser DevTools

1. Open your site
2. Open DevTools (F12)
3. Go to **Network** tab
4. Filter by: `google-analytics.com`
5. Refresh page
6. You should see requests to `google-analytics.com` with status 200

### Check in Browser Console

1. Open your site
2. Open DevTools Console (F12)
3. Type: `window.dataLayer`
4. Press Enter
5. You should see an array with tracking data

---

## Configured Events

### Automatic Events (Built-in)

Google Analytics 4 automatically tracks:
- **Page views** - Every page visited
- **Scrolls** - Users who scroll 90% of page
- **Outbound clicks** - Links to external sites
- **Site search** - If search is implemented
- **Video engagement** - YouTube video interactions
- **File downloads** - PDF, etc.

### Custom Events to Add Later

We can add custom event tracking for:
- **Video clicks** - When user clicks video thumbnail
- **Modal opens** - When video modal opens
- **Contact form submissions** - Form completions
- **Navigation clicks** - Which portfolio sections viewed
- **Client portal login** - Authentication events

---

## Key Metrics to Monitor

### Traffic Sources
- **Direct**: People typing URL directly
- **Organic Search**: Google, Bing results
- **Social**: Instagram, LinkedIn, etc.
- **Referral**: Links from other sites

### User Behavior
- **Pages per session**: How many pages viewed
- **Average session duration**: Time on site
- **Bounce rate**: Single-page visits
- **Top pages**: Most visited pages

### Conversions
- **Contact form submissions**
- **Client portal signups**
- **Booking requests**
- **Video views**

---

## GA4 Dashboard Setup

### Recommended Reports to Create

1. **Portfolio Performance**
   - Page views by portfolio page
   - Time spent on each section
   - Video engagement metrics

2. **Contact Funnel**
   - Homepage → Contact page flow
   - Form completion rate
   - Form abandonment points

3. **Client Journey**
   - Path from discovery to booking
   - Common navigation patterns
   - Exit pages

---

## Enhanced Tracking (Optional - Later)

### Event Tracking Code Example

We can add custom events like this:

```typescript
// Track video click
gtag('event', 'video_click', {
  video_title: 'Nike Black History Month',
  video_id: '406260664',
  video_platform: 'vimeo'
});

// Track contact form submission
gtag('event', 'contact_form_submit', {
  form_location: '/contact'
});
```

### E-commerce Tracking (If Selling Products)

```typescript
gtag('event', 'purchase', {
  transaction_id: 'INV-001',
  value: 500.00,
  currency: 'USD',
  items: [{
    item_name: 'Video Production Package',
    price: 500.00
  }]
});
```

---

## Privacy & GDPR Compliance

### Current Setup
- ✅ Analytics loads only in production
- ✅ No cookies set without user visiting site
- ✅ IP anonymization (GA4 default)

### Future Enhancements (If Needed)
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Cookie policy page
- [ ] Opt-out mechanism

---

## Troubleshooting

### Not Seeing Data?

1. **Check Environment Variable**
   - In Vercel Dashboard → Settings → Environment Variables
   - Verify `NEXT_PUBLIC_GA_ID` is set correctly

2. **Check GA Property**
   - Verify Measurement ID is correct (starts with G-)
   - Check data stream is active

3. **Redeploy Site**
   - After adding env variable, redeploy:
   - Vercel Dashboard → Deployments → Redeploy

4. **Wait 24-48 Hours**
   - GA4 can take up to 48 hours to start showing data

### Data Discrepancies?

- GA4 uses different counting methods than Universal Analytics
- Bots and spam filtered automatically
- Sessions counted differently
- This is normal

---

## Next Steps

### After Setup (Week 3)
1. Create GA4 property
2. Add Measurement ID to Vercel
3. Verify tracking works
4. Set up custom reports

### Future Enhancements (Week 4+)
1. Add custom event tracking
2. Set up conversion goals
3. Create custom dashboards
4. Integrate with Google Search Console

---

## Support Resources

**Google Analytics Help**:
- GA4 Setup Guide: https://support.google.com/analytics/answer/9304153
- GA4 vs Universal Analytics: https://support.google.com/analytics/answer/11583528

**Vercel Environment Variables**:
- https://vercel.com/docs/projects/environment-variables

---

## Summary

✅ **Code Implementation**: Complete
⏳ **GA Property Creation**: Awaiting your action
⏳ **Environment Variable**: Awaiting your configuration
⏳ **Verification**: After above steps complete

**Estimated Setup Time**: 15 minutes

Once you've created the GA4 property and added the Measurement ID to Vercel, analytics will automatically start tracking!

---

**Version**: 1.0
**Status**: Ready for GA Property Creation
