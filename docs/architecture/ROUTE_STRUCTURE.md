# Duke Studios - Route Structure Documentation

This document outlines the complete route structure of the Duke Studios platform, explaining the organization using Next.js 15 App Router route groups.

## Route Groups Overview

Duke Studios uses **route groups** to separate the application into distinct sections with different layouts and themes:

1. **`(marketing)/`** - Public marketing site with light theme
2. **`(auth)/`** - Authentication pages with minimal layout
3. **Root** - Client and admin portals with dark theme

## Complete Route Tree

```
app/
├── (marketing)/                  # Public marketing site
│   ├── layout.tsx               # Light theme layout
│   ├── page.tsx                 # Homepage (/)
│   ├── reel/                    # Featured reel page
│   ├── film/                    # Branded content portfolio
│   ├── edit/                    # Editorial work portfolio
│   ├── shorts/                  # Short form content
│   ├── portfolio/               # Full portfolio grid
│   ├── about/                   # About Adisa Duke
│   ├── contact/                 # Contact form
│   └── services/                # Services detail
│
├── (auth)/                       # Authentication pages
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── verify-email/            # Email verification
│   ├── reset-password/          # Password reset request
│   └── update-password/         # Password update
│
├── dashboard/                    # Client portal (protected)
│   └── page.tsx                 # Client dashboard
│
├── projects/                     # Client projects (protected)
│   ├── page.tsx                 # Project list
│   └── [id]/                    # Project detail
│
├── bookings/                     # Client bookings (protected)
│   └── page.tsx                 # Booking request form
│
├── messages/                     # Client messages (protected)
│   └── page.tsx                 # Message inbox
│
├── invoices/                     # Client invoices (protected)
│   ├── page.tsx                 # Invoice list
│   └── [id]/                    # Invoice detail with payment
│
├── admin/                        # Admin portal (protected, admin only)
│   ├── dashboard/               # Admin dashboard
│   ├── clients/                 # Client management
│   │   ├── page.tsx            # Client list
│   │   └── [id]/               # Client detail with CRM
│   ├── projects/                # Project management
│   │   ├── page.tsx            # Project list
│   │   └── [id]/               # Project detail
│   ├── bookings/                # Booking approvals
│   ├── invoices/                # Invoice management
│   └── settings/                # Admin settings
│
├── actions/                      # Server actions
│   ├── auth.ts                  # Authentication actions
│   ├── bookings.ts              # Booking actions
│   ├── files.ts                 # File upload actions
│   ├── invoices.ts              # Invoice actions
│   ├── messages.ts              # Message actions
│   ├── notifications.ts         # Notification actions
│   └── projects.ts              # Project actions
│
└── api/                          # API routes
    └── stripe/
        └── webhook/              # Stripe webhook handler
```

---

## Route Group Details

### 1. `app/(marketing)/` - Public Marketing Site

**Purpose**: Public-facing portfolio and brand presence for Adisa Duke

**Theme**: Light minimalist
- Background: #F5F2ED
- Font: Karla (Google Fonts)
- Style: Clean, professional, minimalist

**Layout**: `app/(marketing)/layout.tsx`
- Light theme applied via `className="light"`
- MarketingNav component
- MarketingFooter component
- No authentication required

**Pages**:

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Homepage with hero, portfolio showcase, services, client logos |
| `/reel` | `reel/page.tsx` | Featured reel video page |
| `/film` | `film/page.tsx` | Branded content portfolio (12 videos) |
| `/edit` | `edit/page.tsx` | Editorial work portfolio (4 videos) |
| `/shorts` | `shorts/page.tsx` | Short form content |
| `/portfolio` | `portfolio/page.tsx` | Complete portfolio grid (all 16 videos) |
| `/about` | `about/page.tsx` | About Adisa Duke, bio, collaborators |
| `/contact` | `contact/page.tsx` | Contact form for inquiries |
| `/services` | `services/page.tsx` | Services detail (DP, Colorist, Editor, Camera Op) |

**Components Used**:
- MarketingNav
- MarketingFooter
- HeroSection
- ClientLogos (Nike, Puma, HP, Vimeo)
- VideoGrid
- ServicesCards
- CTASection

---

### 2. `app/(auth)/` - Authentication Pages

**Purpose**: User authentication and account management

**Theme**: Minimal (inherits root dark theme but with minimal chrome)

**Layout**: Minimal layout, just the auth form centered

**Pages**:

| Route | File | Purpose |
|-------|------|---------|
| `/login` | `login/page.tsx` | Email/password login |
| `/signup` | `signup/page.tsx` | User registration (client/admin) |
| `/verify-email` | `verify-email/page.tsx` | Email verification confirmation |
| `/reset-password` | `reset-password/page.tsx` | Password reset request |
| `/update-password` | `update-password/page.tsx` | Set new password |

**Features**:
- Email/password authentication via Supabase Auth
- Email verification flow with Resend
- Password reset with secure tokens
- Role selection during signup (client/admin)
- Protected route redirects

---

### 3. Client Portal - Dashboard & Projects

**Purpose**: Client project management and communication

**Theme**: Dark cinematic
- Background: #0a0a0a
- Font: Inter
- Accents: Gold (#FCD34D)

**Layout**: `app/dashboard/layout.tsx` or root layout
- DashboardLayout component
- Sidebar navigation
- Notification center
- User menu

**Authentication**: Required (redirects to `/login` if not authenticated)

**Pages**:

| Route | File | Purpose | Protection |
|-------|------|---------|------------|
| `/dashboard` | `dashboard/page.tsx` | Client dashboard with project overview | Client |
| `/projects` | `projects/page.tsx` | List of all client projects | Client |
| `/projects/[id]` | `projects/[id]/page.tsx` | Project detail with messages, files | Client |
| `/bookings` | `bookings/page.tsx` | Create booking request | Client |
| `/messages` | `messages/page.tsx` | Message inbox across all projects | Client |
| `/invoices` | `invoices/page.tsx` | List of all invoices | Client |
| `/invoices/[id]` | `invoices/[id]/page.tsx` | Invoice detail with Stripe payment | Client |

**Features**:
- Real-time project updates
- Direct messaging with admin
- File downloads
- Invoice viewing and payment
- Booking requests
- Notification center

---

### 4. Admin Portal

**Purpose**: Studio management, client CRM, project oversight

**Theme**: Dark cinematic (same as client portal)

**Layout**: Admin-specific layout with admin navigation

**Authentication**: Required + Admin role check (redirects to `/dashboard` if not admin)

**Pages**:

| Route | File | Purpose |
|-------|------|---------|
| `/admin/dashboard` | `admin/dashboard/page.tsx` | Admin dashboard with revenue stats |
| `/admin/clients` | `admin/clients/page.tsx` | Client list with search |
| `/admin/clients/[id]` | `admin/clients/[id]/page.tsx` | Client detail page with full CRM |
| `/admin/projects` | `admin/projects/page.tsx` | All projects list |
| `/admin/projects/[id]` | `admin/projects/[id]/page.tsx` | Project management page |
| `/admin/bookings` | `admin/bookings/page.tsx` | Booking requests (approve/decline) |
| `/admin/invoices` | `admin/invoices/page.tsx` | Invoice management |
| `/admin/settings` | `admin/settings/page.tsx` | Admin settings (profile, notifications) |

**Features**:
- Full project CRUD operations
- Client relationship management
- Booking approval/decline
- Invoice creation with Stripe
- File upload to projects
- Real-time notifications
- Revenue analytics
- Status tracking
- Message all clients

---

## Server Actions (`app/actions/`)

Server actions handle all data mutations and backend logic.

| File | Purpose |
|------|---------|
| `auth.ts` | Authentication (login, signup, logout) |
| `bookings.ts` | Booking CRUD, approve/decline |
| `files.ts` | File upload, download, delete |
| `invoices.ts` | Invoice CRUD, Stripe integration |
| `messages.ts` | Send messages, mark as read |
| `notifications.ts` | Create, mark as read, delete |
| `projects.ts` | Project CRUD, status updates |

**Usage**:
```typescript
import { approveBooking } from '@/app/actions/bookings'

const result = await approveBooking(bookingId)
```

---

## API Routes (`app/api/`)

REST API endpoints for external integrations.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stripe/webhook` | POST | Stripe webhook handler for payment events |

**Webhook Events Handled**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid`
- `invoice.payment_failed`

---

## Protection & Middleware

### Authentication Middleware

**File**: `middleware.ts`

**Purpose**: Protects routes and redirects unauthenticated users

**Protected Routes**:
- `/dashboard`
- `/projects`
- `/bookings`
- `/messages`
- `/invoices`
- `/admin/*`

**Behavior**:
- Unauthenticated users → Redirect to `/login`
- Authenticated non-admins accessing `/admin/*` → Redirect to `/dashboard`
- Authenticated users accessing auth pages → Redirect to `/dashboard`

---

## Theme Application by Route

| Route Group | Theme | Font | Background | Applied Via |
|-------------|-------|------|------------|-------------|
| `(marketing)` | Light | Karla | #F5F2ED | Route layout `className="light"` |
| `(auth)` | Dark | Inter | #0a0a0a | Root layout `className="dark"` |
| Root (client/admin) | Dark | Inter | #0a0a0a | Root layout `className="dark"` |

**CSS Variables**:
- `.light` class applies light theme variables
- `.dark` class (default) applies dark theme variables
- Both defined in `app/globals.css`

---

## Navigation Components

### MarketingNav (`components/marketing/MarketingNav.tsx`)
- Used in: `(marketing)` layout
- Links: Home, Reel, Branded, Editorial, Shorts, Contact, Client Portal

### DashboardNav (`components/layout/DashboardNav.tsx`)
- Used in: Client portal
- Links: Dashboard, Projects, Bookings, Messages, Invoices

### AdminNav (`components/layout/AdminNav.tsx` or within DashboardNav)
- Used in: Admin portal
- Links: Dashboard, Clients, Projects, Bookings, Invoices, Settings

---

## Data Flow

### Marketing Site → Client Portal
1. User visits marketing site (`/`)
2. Clicks "Client Portal" button
3. Redirects to `/login`
4. After authentication → `/dashboard`

### Client Portal Flow
1. Client logs in → `/dashboard`
2. Views projects → `/projects`
3. Clicks project → `/projects/[id]`
4. Sends message via server action
5. Downloads file from project
6. Views invoice → `/invoices/[id]`
7. Pays via Stripe Checkout

### Admin Portal Flow
1. Admin logs in → `/admin/dashboard`
2. Views clients → `/admin/clients`
3. Opens client detail → `/admin/clients/[id]`
4. Creates project for client
5. Approves booking → `/admin/bookings`
6. Creates invoice with Stripe
7. Uploads file to project

---

## Future Routes (Planned)

- `/admin/analytics` - Advanced analytics dashboard
- `/admin/calendar` - Booking calendar integration
- `/admin/team` - Team member management (if multi-user)
- `/services/[slug]` - Individual service pages
- `/blog` - Blog for SEO and content marketing

---

## Best Practices

### Adding New Routes

1. **Determine route group**: Marketing, auth, client, or admin?
2. **Create page.tsx** in appropriate folder
3. **Add to navigation** component
4. **Add protection** if needed (middleware or page-level auth check)
5. **Apply correct theme** via layout
6. **Update this documentation**

### Route Naming Conventions

- Use **kebab-case** for route segments (`reset-password`, not `resetPassword`)
- Use **descriptive names** that match the purpose
- Use **plural** for list pages (`/projects`, `/clients`)
- Use **[id]** for dynamic routes (`/projects/[id]`)

### Layout Hierarchy

```
app/layout.tsx (root)
├── (marketing)/layout.tsx (light theme)
├── (auth)/ (inherits root)
└── dashboard/layout.tsx (dark theme, sidebar)
    └── admin/layout.tsx (admin nav)
```

---

**Last Updated**: December 1, 2025
**Version**: 1.0
**Zorath LLC** | Duke Studios
