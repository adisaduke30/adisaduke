# Duke Studios Documentation

Comprehensive documentation for the Duke Studios video production platform.

**Last Updated**: December 1, 2025 (YouTube Support Added)
**Current Progress**: 62% Complete
**Status**: Production-ready foundation with complete marketing site and portfolio pages

---

## Documentation Structure

```
docs/
├── README.md (this file)
├── project_logs.json (detailed progress tracking)
│
├── architecture/              # System architecture
│   ├── OVERVIEW.md           # High-level system architecture
│   ├── ROUTE_STRUCTURE.md    # Complete route documentation
│   └── THEME_SYSTEM.md       # Dual theme implementation
│
├── features/                  # Feature documentation
│   ├── MARKETING_SITE.md     # Week 1 marketing site
│   ├── PORTFOLIO_PAGES.md    # Week 2 portfolio pages
│   └── VIDEO_INVENTORY.md    # Complete video catalog
│
├── components/                # Component documentation
│   └── MARKETING_COMPONENTS.md  # 12 marketing components
│
├── api/                       # API documentation
│   └── SERVER_ACTIONS.md     # All server actions
│
├── STRIPE_SETUP.md           # Stripe integration guide
├── DEPLOYMENT.md             # Production deployment
└── LAUNCH_CHECKLIST.md       # Pre-launch verification
```

---

## Quick Navigation

### Getting Started

- **[Project Overview](../README.md)** - Main README with setup instructions
- **[Database Setup](../DATABASE_SETUP.md)** - Database migration guide
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production
- **[Project Status](../PROJECT_STATUS.md)** - Current progress summary

### Architecture

- **[System Overview](architecture/OVERVIEW.md)** - Complete architecture overview
- **[Route Structure](architecture/ROUTE_STRUCTURE.md)** - All routes documented
- **[Theme System](architecture/THEME_SYSTEM.md)** - Dual theme implementation

### Features

- **[Marketing Site](features/MARKETING_SITE.md)** - Week 1 implementation details
- **[Portfolio Pages](features/PORTFOLIO_PAGES.md)** - Week 2 portfolio pages with video playback
- **[Video Inventory](features/VIDEO_INVENTORY.md)** - Complete catalog of 16 portfolio videos

### Components

- **[Marketing Components](components/MARKETING_COMPONENTS.md)** - 12 components documented

### API

- **[Server Actions](api/SERVER_ACTIONS.md)** - All 26 server actions

### Setup & Configuration

- **[Stripe Setup](STRIPE_SETUP.md)** - Payment integration
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-launch verification

---

## Project Status Summary

### Completed (62%)

**Phase 1: Foundation** ✅
- Next.js 15 with TypeScript
- Supabase database (9 tables with RLS)
- Vercel deployment
- Content inventory (16 videos)

**Phase 2: Email Integration** ✅
- Resend API configured
- 9 professional React Email templates
- Email sending utilities
- Integration into all server actions

**Phase 3: Authentication & Core Pages** ✅
- Login, signup, verify, reset pages
- Protected routes with middleware
- Client and admin dashboards
- All core portal pages

**Phase 4: Admin Features** ✅
- Full admin dashboard with statistics
- Client management with detail pages
- Booking approval/decline backend
- Invoice creation with Stripe
- Real-time notifications

**Phase 5: Advanced Features** ✅
- Supabase Realtime hooks
- Admin settings page
- Client detail pages with CRM
- Real-time updates

**Phase 6: Production Preparation** ✅
- Deployment documentation
- Error boundary component
- README overhaul
- Launch checklist

**Week 1: Marketing Site** ✅
- 7 marketing components built
- Homepage rebuilt with inventory data
- Dual theme system (light for marketing, dark for app)
- 16 portfolio videos integrated

**Week 2: Portfolio Pages** ✅
- 12 marketing components (added 5 new)
- Vimeo & YouTube Player integration
- 6 portfolio pages (/reel, /film, /edit, /shorts, /about, /contact)
- Contact form with email delivery
- VideoModal with full-screen playback
- Platform-agnostic VideoPlayer wrapper
- Comprehensive documentation (PORTFOLIO_PAGES.md, VIDEO_INVENTORY.md)

### In Progress (8%)

**Week 3: Polish & Optimization**
- SEO optimization (Open Graph, structured data)
- Performance tuning (Image optimization, lazy loading)
- Accessibility improvements
- Browser compatibility testing

---

## Documentation by Topic

### Architecture & System Design

| Document | Description | Lines |
|----------|-------------|-------|
| [OVERVIEW.md](architecture/OVERVIEW.md) | Complete system architecture | 650 |
| [ROUTE_STRUCTURE.md](architecture/ROUTE_STRUCTURE.md) | Route organization and protection | 230 |
| [THEME_SYSTEM.md](architecture/THEME_SYSTEM.md) | Dual theme implementation | 400 |

**Total**: 1,280 lines

### Feature Documentation

| Document | Description | Lines |
|----------|-------------|-------|
| [MARKETING_SITE.md](features/MARKETING_SITE.md) | Week 1 marketing site implementation | 600 |
| [PORTFOLIO_PAGES.md](features/PORTFOLIO_PAGES.md) | Week 2 portfolio pages with video playback | 1,150 |
| [VIDEO_INVENTORY.md](features/VIDEO_INVENTORY.md) | Complete catalog of 16 portfolio videos | 350 |

**Total**: 2,100 lines

### Component Documentation

| Document | Description | Lines |
|----------|-------------|-------|
| [MARKETING_COMPONENTS.md](components/MARKETING_COMPONENTS.md) | 12 marketing components (Vimeo + YouTube) | 1,470 |

**Total**: 1,470 lines

### API Documentation

| Document | Description | Lines |
|----------|-------------|-------|
| [SERVER_ACTIONS.md](api/SERVER_ACTIONS.md) | 26 server actions across 7 files | 550 |

**Total**: 550 lines

### Setup & Deployment

| Document | Description | Lines |
|----------|-------------|-------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide | 370 |
| [STRIPE_SETUP.md](STRIPE_SETUP.md) | Stripe integration setup | 250 |
| [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) | Pre-launch verification | 340 |

**Total**: 960 lines

---

## Tech Stack Reference

### Frontend
- Next.js 15 (App Router, Server Components)
- TypeScript (strict mode)
- TailwindCSS (dual theme system)
- Shadcn/UI component library
- Fonts: Karla (marketing), Inter (dashboard)

### Backend
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- Server Actions (26 actions across 7 files)
- Row Level Security (RLS) on all tables

### Third-Party Services
- Stripe (payments, invoices, webhooks)
- Resend (email with 9 React Email templates)
- Vercel (hosting, edge functions)

### Key Features
- Dual theme (light #F5F2ED for marketing, dark #0a0a0a for app)
- Real-time notifications and messages (WebSocket)
- File upload/download (Supabase Storage)
- Email notifications for all events
- Stripe payment processing

---

## Database Schema

**9 Tables**:
1. `users` - User accounts (client/admin roles)
2. `projects` - Production projects with status tracking
3. `project_messages` - Real-time messaging per project
4. `project_files` - File deliverables with versioning
5. `invoices` - Stripe-integrated invoices
6. `bookings` - Client booking requests
7. `notifications` - Real-time notifications
8. `client_notes` - Admin-only client notes
9. `payments` - Payment tracking (future)

**Security**: Row Level Security (RLS) enabled on all tables

See [architecture/OVERVIEW.md](architecture/OVERVIEW.md) for detailed schema.

---

## Component Inventory

### Marketing Components (12)

**Week 1 (7 components)**:
1. MarketingNav - Responsive navigation
2. MarketingFooter - Footer with links
3. HeroSection - Homepage hero
4. ClientLogos - Client showcase (Nike, Puma, HP, Vimeo)
5. VideoGrid - Portfolio video display with modal playback
6. ServicesCards - Services showcase
7. CTASection - Call-to-action

**Week 2 (5 components)**:
8. VimeoPlayer - Vimeo video embedding
9. VideoModal - Full-screen video player dialog
10. ContactForm - Contact form with validation
11. YouTubePlayer - YouTube video embedding (Dec 1)
12. VideoPlayer - Platform-agnostic wrapper (Dec 1)

See [components/MARKETING_COMPONENTS.md](components/MARKETING_COMPONENTS.md) for details.

### Admin Components (15+)
- DashboardLayout
- StatsCard
- ProjectCard
- ClientCard
- BookingCard
- InvoiceCard
- NotificationCenter
- And more...

---

## Server Actions Inventory

**7 Action Files** with **26 Actions**:

1. **auth.ts** - Authentication (5 actions)
   - signIn, signUp, signOut, requestPasswordReset, updatePassword

2. **bookings.ts** - Booking management (3 actions)
   - createBooking, approveBooking, declineBooking

3. **files.ts** - File operations (4 actions)
   - uploadFile, deleteFile, markFileAsFinal, getSignedUrl

4. **invoices.ts** - Invoice management (3 actions)
   - createInvoice, updateInvoiceStatus, getInvoicePaymentUrl

5. **messages.ts** - Messaging (3 actions)
   - sendMessage, markMessageAsRead, getProjectMessages

6. **notifications.ts** - Notifications (4 actions)
   - createNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification

7. **projects.ts** - Project management (4 actions)
   - createProject, updateProjectStatus, updateProject, deleteProject

See [api/SERVER_ACTIONS.md](api/SERVER_ACTIONS.md) for complete reference.

---

## Email Templates

**9 React Email Templates**:
1. WelcomeEmail - New user signup
2. BookingConfirmedEmail - Booking approved
3. BookingDeclinedEmail - Booking declined
4. NewInvoiceEmail - Invoice created
5. PaymentReceivedEmail - Payment successful
6. NewMessageEmail - Message received
7. ProjectStatusEmail - Project status changed
8. NewFileEmail - File uploaded
9. PasswordResetEmail - Password reset

All templates use Duke Studios branding with black/white color scheme.

---

## Routes Overview

### Marketing Site (Public) ✅
- `/` - Homepage with portfolio
- `/reel` - Featured reel with HP Sprocket
- `/film` - Branded content (12 videos)
- `/edit` - Editorial work (4 videos, Vimeo + YouTube)
- `/shorts` - Short form (Nike BHM Day in Life)
- `/about` - About Adisa Duke
- `/contact` - Contact form with email delivery

### Client Portal (Protected)
- `/dashboard` - Client dashboard
- `/projects` - Project list
- `/projects/[id]` - Project detail
- `/bookings` - Booking requests
- `/messages` - Message inbox
- `/invoices` - Invoice list
- `/invoices/[id]` - Invoice detail with payment

### Admin Portal (Admin Only)
- `/admin/dashboard` - Admin dashboard
- `/admin/clients` - Client list
- `/admin/clients/[id]` - Client detail
- `/admin/projects` - Project management
- `/admin/projects/[id]` - Project detail
- `/admin/bookings` - Booking approvals
- `/admin/invoices` - Invoice management
- `/admin/settings` - Admin settings

See [architecture/ROUTE_STRUCTURE.md](architecture/ROUTE_STRUCTURE.md) for complete details.

---

## Tracking & Progress

### project_logs.json

Machine-readable JSON with:
- Overall progress (45%)
- Completed tasks by category
- Pending work breakdown
- Timeline and milestones
- Tech stack details
- Database schema status

**Updated**: December 1, 2025, 18:30 UTC

### PROJECT_STATUS.md

Human-readable Markdown with:
- Progress summary
- Recent accomplishments
- Timeline
- Milestones
- Next actions

**Updated**: December 1, 2025, 18:30 UTC

---

## For Developers

### Adding Documentation

When adding new features:

1. **Update progress** in `project_logs.json` and `PROJECT_STATUS.md`
2. **Create feature doc** in `docs/features/{FEATURE_NAME}.md`
3. **Document components** in `docs/components/` if applicable
4. **Document API** in `docs/api/` if new server actions
5. **Update this README** with links to new docs

### Documentation Standards

- Use Markdown format
- Include code examples
- Add usage patterns
- Document props/parameters
- Include best practices
- Show common patterns
- Add troubleshooting sections

---

## For Stakeholders

### Quick Health Check

**Current Status**: ✅ 62% Complete

**Production Ready**:
- ✅ Backend infrastructure
- ✅ Authentication system
- ✅ Client portal
- ✅ Admin portal
- ✅ Email notifications
- ✅ Marketing site (complete)
- ✅ Portfolio pages (6 pages)
- ✅ Video playback (Vimeo + YouTube)
- ✅ Contact form

**In Progress**:
- 🔄 SEO optimization
- 🔄 Performance tuning
- 🔄 Final polish

**Remaining**:
- ⏳ Open Graph images
- ⏳ Structured data (Schema.org)
- ⏳ Image optimization
- ⏳ Accessibility audit

### Key Metrics

- **Total Documentation**: ~5,500 lines
- **Components Built**: 30+ components (12 marketing + 18 admin)
- **Routes Implemented**: 27 routes
- **Server Actions**: 26 actions
- **Email Templates**: 9 templates
- **Database Tables**: 9 tables
- **Portfolio Videos**: 15 displayable (14 Vimeo, 1 YouTube)
- **Build Status**: ✅ Passing

---

## Support

**Developer**: Luis Disla (Zorath LLC)
**Email**: adisaduke30@yahoo.com
**Repository**: https://github.com/adisaduke30/duke-studios
**Deployment**: https://duke-studios.vercel.app

---

**Version**: 1.0
**Last Updated**: December 1, 2025
**Zorath LLC** | Duke Studios Platform Development
