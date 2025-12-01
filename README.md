# Duke Studios - Professional Video Production Platform

A comprehensive client management and project collaboration platform built for Duke Studios, enabling seamless communication between the production team and clients.

**Built by Zorath LLC**

## Features

### Public Marketing Site
- **Homepage**: Professional portfolio showcase with featured work
- **Portfolio Pages**:
  - `/reel` - Curated selection of 5 best videos
  - `/film` - All 12 branded content videos (Nike, Puma, HP, etc.)
  - `/edit` - 4 editorial videos with project highlights
  - `/shorts` - Short-form social media content
  - `/about` - Professional bio, client showcase, collaborators
  - `/contact` - Contact form with email delivery + booking link
- **Video Playback**: Vimeo Player integration with full-screen modal playback
- **Services Breakdown**: DP, Colorist, Editor, Camera Operator capabilities
- **Client Showcase**: Prominent display of major brand collaborations (Nike, Puma, HP, Vimeo)
- **Responsive Design**: Mobile-first with Karla font and light minimalist aesthetic
- **SEO Optimized**: Meta tags on all pages

### Client Portal
- **Project Dashboard**: View all projects with real-time status updates
- **Booking System**: Request consultations and production services
- **Messaging**: Direct communication with the Duke Studios team
- **File Deliverables**: Download final videos and production assets
- **Invoice Management**: View and pay invoices securely via Stripe
- **Real-time Notifications**: Instant updates on project progress

### Admin Dashboard
- **Project Management**: Full project lifecycle management (Pre-production → Shooting → Editing → Review → Delivered)
- **Client Relationship Management**: Detailed client profiles with project history
- **Booking Management**: Approve/decline booking requests with automated emails
- **Invoice Creation**: Generate professional invoices with multiple line items and optional deposits
- **File Upload**: Share deliverables with version tracking and final delivery marking
- **Real-time Communication**: Instant messaging with clients per project
- **Analytics**: Revenue tracking, project statistics, and client insights
- **Settings**: Profile management and notification preferences

## Tech Stack

- **Next.js 15**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development
- **Supabase**: PostgreSQL database, authentication, storage, and real-time subscriptions
- **Stripe**: Payment processing and invoice management with webhooks
- **Resend**: Transactional email delivery with React Email templates
- **TailwindCSS + Shadcn/UI**: Modern, accessible component library with dual theme system
- **Supabase Realtime**: WebSocket-based real-time updates
- **Fonts**: Karla (marketing site), Inter (dashboard)
- **Dual Theme**: Light minimalist (#F5F2ED) for marketing, dark cinematic for app

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. Clone and install:
```bash
git clone https://github.com/your-repo/duke-studios.git
cd duke-studios
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Resend
RESEND_API_KEY=re_your_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Complete production deployment instructions
- **[Stripe Setup](docs/STRIPE_SETUP.md)** - Payment integration configuration
- **[Database Setup](DATABASE_SETUP.md)** - Database migration instructions
- **[Marketing Site](docs/features/MARKETING_SITE.md)** - Week 1 marketing site documentation
- **[Architecture](docs/architecture/OVERVIEW.md)** - System architecture overview

## Project Structure

```
duke-studios/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Public marketing site (light theme)
│   │   ├── page.tsx        # Homepage with portfolio
│   │   ├── reel/           # Featured reel page
│   │   ├── film/           # Branded content portfolio
│   │   ├── edit/           # Editorial work page
│   │   ├── shorts/         # Short form content
│   │   ├── about/          # About Adisa Duke
│   │   ├── contact/        # Contact form
│   │   └── layout.tsx      # Marketing layout
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── admin/               # Admin dashboard (dark theme)
│   ├── dashboard/           # Client portal (dark theme)
│   ├── actions/             # Server actions
│   └── api/                 # API routes (webhooks)
├── components/              # React components
│   ├── marketing/          # Marketing components (10 components)
│   ├── admin/              # Admin components
│   ├── layout/             # Layouts & navigation
│   └── ui/                 # Shadcn UI components
├── emails/                  # React Email templates (10 templates)
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
│   ├── email/              # Email templates (9 templates)
│   ├── supabase/           # Database utilities
│   ├── stripe.ts           # Stripe config
│   └── resend.ts           # Email config
├── content-migration/       # Portfolio data
│   └── inventory.json      # 16 videos, branding specs
└── docs/                    # Documentation
```

## Key Features

### Dual Theme System
- **Light Marketing Theme**: Karla font, #F5F2ED background, minimalist design for public site
- **Dark Dashboard Theme**: Inter font, #0a0a0a background, cinematic design for app
- **Route-based**: Themes automatically applied via route groups
- **CSS Variables**: Seamless theme switching with HSL color variables

### Marketing Components
- **MarketingNav**: Responsive navigation with mobile menu
- **HeroSection**: Compelling homepage hero with CTAs
- **VideoGrid**: Portfolio video showcase with Vimeo thumbnails
- **ClientLogos**: Major brand display (Nike, Puma, HP, Vimeo)
- **ServicesCards**: Services breakdown with icons
- **CTASection**: Customizable call-to-action sections
- **MarketingFooter**: Social links and copyright

### Real-time Updates
- **Notifications**: Instant notification badge updates via Supabase Realtime
- **Messages**: Live project message synchronization
- **No polling**: Efficient WebSocket connections

### Payment Processing
- **Stripe Invoices**: Professional invoices with line items
- **Stripe Checkout**: Secure payment processing
- **Webhooks**: Automatic status updates on payment events
- **Deposits**: Optional deposit percentage support

### Email Notifications
Beautiful React Email templates for:
- Welcome and verification
- Booking approvals/rejections
- Invoice delivery
- Payment confirmations
- Project status updates
- New messages
- File deliverables

### Security
- Row Level Security (RLS) on all Supabase tables
- Server-side API key management
- Webhook signature verification
- Signed URLs for secure file access
- Type-safe server actions

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

## Database Tables

- `users` - Accounts (clients & admins)
- `projects` - Production projects
- `bookings` - Booking requests
- `project_messages` - Project messaging
- `project_files` - File deliverables
- `invoices` - Payment invoices
- `notifications` - User notifications

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `RESEND_API_KEY` - Resend API key
- `NEXT_PUBLIC_APP_URL` - Application URL

### Optional
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `ADMIN_USER_ID` - Primary admin user ID

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete production setup.

## Support

- **Email**: adisaduke30@yahoo.com
- **Developer**: Zorath LLC

---

**Version**: 1.0.0
**Last Updated**: December 2025
**License**: Proprietary - Zorath LLC
