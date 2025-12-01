# Duke Studios - System Architecture Overview

High-level overview of the Duke Studios platform architecture, technology stack, and system design.

**Version**: 1.0
**Last Updated**: December 1, 2025
**Status**: 45% Complete (Phases 1-6 + Week 1)

---

## Executive Summary

Duke Studios is a comprehensive video production studio management platform built for filmmaker Adisa Duke. The platform combines a public portfolio website with a full-featured client and admin portal for project management, communication, invoicing, and file delivery.

**Platform Components**:
1. **Public Marketing Site** - Portfolio showcase
2. **Client Portal** - Project management and communication
3. **Admin Portal** - Studio management and CRM
4. **Backend Infrastructure** - Database, auth, storage, email

**Technology**: Next.js 15, TypeScript, Supabase, Stripe, Resend

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Duke Studios                             │
│                    (Next.js 15 App Router)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌──────────────────────┐          ┌──────────────────────┐
│   Marketing Site     │          │   Application        │
│   (Light Theme)      │          │   (Dark Theme)       │
│                      │          │                      │
│  - Homepage          │          │  - Client Portal     │
│  - Portfolio Pages   │          │  - Admin Portal      │
│  - About/Contact     │          │  - Authentication    │
│                      │          │                      │
│  Route: (marketing)  │          │  Route: /dashboard   │
│  Font: Karla         │          │  Font: Inter         │
│  Color: #F5F2ED      │          │  Color: #0a0a0a      │
└──────────────────────┘          └──────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │ Supabase   │  │  Stripe    │  │  Resend    │  │  Vercel    ││
│  │            │  │            │  │            │  │            ││
│  │ - Database │  │ - Payments │  │ - Email    │  │ - Hosting  ││
│  │ - Auth     │  │ - Invoices │  │ - 9 tmpl   │  │ - Edge Fn  ││
│  │ - Storage  │  │ - Webhooks │  │            │  │ - Analytics││
│  │ - Realtime │  │            │  │            │  │            ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

**Framework**: Next.js 15
- App Router with route groups
- React Server Components
- Server Actions for mutations
- Middleware for authentication

**Language**: TypeScript
- Full type safety
- Strict mode enabled
- Type generation from Supabase

**Styling**: TailwindCSS
- Dual theme system (light/dark)
- Utility-first approach
- Custom CSS variables
- Responsive design (mobile-first)

**Component Library**: Shadcn/UI
- Accessible components
- Radix UI primitives
- Customizable with Tailwind

**Fonts**:
- **Karla** - Marketing site (light theme)
- **Inter** - Dashboard (dark theme)
- **JetBrains Mono** - Code/monospace

**Animations**: Framer Motion
- Installed and ready
- To be implemented in Week 2-3

### Backend

**Database**: Supabase PostgreSQL
- 9 tables with relationships
- Row Level Security (RLS) on all tables
- Database triggers and functions
- Type-safe queries

**Authentication**: Supabase Auth
- Email/password authentication
- Session management
- Email verification
- Password reset flow

**Storage**: Supabase Storage
- File uploads (videos, documents)
- Signed URLs for secure access
- Bucket: `project_files`

**Real-time**: Supabase Realtime
- WebSocket connections
- Live notifications
- Live messages
- No polling needed

### Third-Party Services

**Payments**: Stripe
- Invoice creation
- Payment processing
- Stripe Checkout
- Webhooks for status updates

**Email**: Resend
- Transactional emails
- React Email templates (9 total)
- All event notifications
- Professional branding

**Hosting**: Vercel
- Automatic deployments
- Edge functions
- Environment variables
- Analytics (optional)

---

## Database Schema

### Core Tables (9 total)

```
users
├── id (uuid, PK)
├── email
├── name
├── role (client | admin)
├── company
├── phone
└── created_at

projects
├── id (uuid, PK)
├── client_id (FK → users)
├── name
├── description
├── status (pending | pre_production | shooting | editing | review | delivered)
├── deadline
├── budget
└── created_at

project_messages
├── id (uuid, PK)
├── project_id (FK → projects)
├── sender_id (FK → users)
├── content
├── read_at
└── created_at

project_files
├── id (uuid, PK)
├── project_id (FK → projects)
├── file_name
├── file_url
├── file_size
├── is_final (boolean)
└── created_at

invoices
├── id (uuid, PK)
├── project_id (FK → projects)
├── invoice_number
├── amount (cents)
├── status (draft | sent | paid | partial | overdue)
├── stripe_invoice_id
├── due_date
├── paid_at
└── created_at

bookings
├── id (uuid, PK)
├── client_id (FK → users)
├── service_type
├── desired_date
├── message
├── budget
├── status (pending | approved | declined)
└── created_at

notifications
├── id (uuid, PK)
├── user_id (FK → users)
├── type
├── title
├── message
├── action_url
├── read_at
└── created_at

client_notes (admin-only)
├── id (uuid, PK)
├── client_id (FK → users)
├── note
├── created_by (FK → users)
└── created_at

payments (future)
├── id (uuid, PK)
├── invoice_id (FK → invoices)
├── amount
├── stripe_payment_id
├── paid_at
└── created_at
```

### Relationships

- User → Projects (1:many)
- Project → Messages (1:many)
- Project → Files (1:many)
- Project → Invoices (1:many)
- User → Bookings (1:many)
- User → Notifications (1:many)

### Security: Row Level Security (RLS)

**Clients**:
- Can view only their own projects, messages, files
- Can create bookings
- Can view their own invoices

**Admins**:
- Can view and modify all data
- Can create projects, invoices
- Can upload files
- Can approve/decline bookings

**Policies**:
```sql
-- Example: Clients can only see their projects
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = client_id OR auth.uid() IN (
  SELECT id FROM users WHERE role = 'admin'
));
```

---

## Route Structure

### Route Groups

Duke Studios uses Next.js route groups to separate concerns:

**1. `app/(marketing)/`** - Public site
- Light theme
- Karla font
- Routes: /, /reel, /film, /edit, /shorts, /contact

**2. `app/(auth)/`** - Authentication
- Minimal layout
- Routes: /login, /signup, /verify-email, /reset-password

**3. Root** - Application
- Dark theme
- Inter font
- Routes: /dashboard, /projects, /admin/*

### Protection Levels

| Route | Authentication | Role |
|-------|----------------|------|
| `/` | None | Public |
| `/reel` | None | Public |
| `/login` | None (redirect if auth) | Public |
| `/dashboard` | Required | Client |
| `/projects/*` | Required | Client |
| `/admin/*` | Required | Admin |

**Middleware**: `middleware.ts` handles route protection

---

## Data Flow

### Client Booking Flow

```
1. Client visits marketing site (/)
2. Fills booking form (/bookings)
   ├─→ Server Action: createBooking()
   ├─→ Database: INSERT into bookings
   ├─→ Notification: Created for admin
   └─→ Email: Booking confirmation to client

3. Admin reviews booking (/admin/bookings)
4. Admin approves booking
   ├─→ Server Action: approveBooking()
   ├─→ Database: UPDATE booking status
   ├─→ Database: INSERT new project
   ├─→ Notification: Created for client
   └─→ Email: Booking approved to client

5. Client views project (/projects/{id})
6. Admin and client communicate via messages
   ├─→ Server Action: sendMessage()
   ├─→ Database: INSERT into messages
   ├─→ Realtime: Message appears instantly
   └─→ Email: Message notification

7. Admin uploads final deliverable
   ├─→ Server Action: uploadFile()
   ├─→ Storage: Upload to Supabase
   ├─→ Database: INSERT file record
   └─→ Email: File delivery notification

8. Admin creates invoice
   ├─→ Server Action: createInvoice()
   ├─→ Stripe: Create invoice
   ├─→ Database: INSERT invoice record
   └─→ Email: Invoice notification

9. Client pays invoice
   ├─→ Stripe: Checkout session
   ├─→ Webhook: Payment success
   ├─→ Database: UPDATE invoice status
   └─→ Email: Payment confirmation
```

### Real-time Updates

**Notifications**:
```
Server Action → Database INSERT
      ↓
Supabase Realtime (WebSocket)
      ↓
Client Hook (useRealtimeNotifications)
      ↓
UI Update (notification badge)
```

**Messages**:
```
Server Action → Database INSERT
      ↓
Supabase Realtime (WebSocket)
      ↓
Client Hook (useRealtimeMessages)
      ↓
UI Update (message thread)
```

---

## Theme System

### Dual Theme Architecture

Duke Studios implements two complete themes:

**Light Theme** (Marketing):
- Background: #F5F2ED
- Text: #151515
- Font: Karla
- Applied via: `<div className="light">`

**Dark Theme** (App):
- Background: #0a0a0a
- Text: #ffffff
- Font: Inter
- Applied via: `<html className="dark">`

### CSS Variables

```css
:root {
  /* Dark theme variables */
  --background: 0 0% 4%;
  --foreground: 0 0% 100%;
  --primary: 51 100% 50%; /* Gold */
}

.light {
  /* Light theme variables */
  --background: 43 29% 95%;
  --foreground: 0 0% 8%;
  --primary: 0 0% 13%;
}
```

### Theme Application

```typescript
// Root layout (dark)
<html className="dark">

// Marketing layout (light)
<div className="light font-karla">
  <MarketingNav />
  {children}
</div>
```

---

## Authentication Flow

### Sign Up

```
1. User fills signup form
2. Server Action: signUp()
3. Supabase Auth: Create user
4. Database: Insert user profile
5. Resend: Send welcome + verification email
6. Redirect to: /verify-email
```

### Login

```
1. User fills login form
2. Server Action: signIn()
3. Supabase Auth: Sign in with password
4. Set session cookie
5. Redirect to: /dashboard (client) or /admin/dashboard (admin)
```

### Password Reset

```
1. User requests reset at /reset-password
2. Server Action: requestPasswordReset()
3. Supabase Auth: Generate reset token
4. Resend: Send reset email with link
5. User clicks link → /update-password?token=...
6. User sets new password
7. Server Action: updatePassword()
```

### Session Management

- Sessions stored in HTTP-only cookies
- Middleware checks session on protected routes
- Auto-refresh on activity
- Logout clears session

---

## Email System

### Email Templates (9 total)

Located in `lib/email/templates.tsx`:

1. **WelcomeEmail** - New user signup
2. **BookingConfirmedEmail** - Booking approved
3. **BookingDeclinedEmail** - Booking declined
4. **NewInvoiceEmail** - Invoice created
5. **PaymentReceivedEmail** - Payment successful
6. **NewMessageEmail** - Message received
7. **ProjectStatusEmail** - Project status changed
8. **NewFileEmail** - File uploaded
9. **PasswordResetEmail** - Password reset request

### Email Triggers

| Event | Trigger | Template |
|-------|---------|----------|
| User signs up | signUp() | WelcomeEmail |
| Booking approved | approveBooking() | BookingConfirmedEmail |
| Booking declined | declineBooking() | BookingDeclinedEmail |
| Invoice created | createInvoice() | NewInvoiceEmail |
| Payment received | Stripe webhook | PaymentReceivedEmail |
| Message sent | sendMessage() | NewMessageEmail |
| Status updated | updateProjectStatus() | ProjectStatusEmail |
| File uploaded (final) | markFileAsFinal() | NewFileEmail |

### Email Configuration

```typescript
// lib/resend.ts
export const emailConfig = {
  from: 'Duke Studios <noreply@adisaduke.com>',
  replyTo: 'adisaduke30@yahoo.com',
}
```

---

## Payment Processing

### Stripe Integration

**Invoice Creation**:
```
1. Admin creates invoice via createInvoice()
2. Stripe Invoice created with line items
3. Database invoice record with stripe_invoice_id
4. Email sent to client with payment link
```

**Payment Flow**:
```
1. Client clicks "Pay Now" button
2. Server Action: getInvoicePaymentUrl()
3. Stripe Checkout session created
4. Client redirects to Stripe Checkout
5. Client completes payment
6. Stripe webhook triggers
7. Server updates invoice status to 'paid'
8. Email confirmation sent
```

**Webhook Handler**: `/api/stripe/webhook`

**Events Handled**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid`
- `invoice.payment_failed`

---

## File Management

### Storage Architecture

**Bucket**: `project_files`

**Path Structure**:
```
project_files/
  └── {projectId}/
      ├── {timestamp}_file1.mp4
      ├── {timestamp}_file2.pdf
      └── {timestamp}_final_edit.mp4
```

### Upload Flow

```
1. Admin selects file in UI
2. Form submission with File object
3. Server Action: uploadFile()
4. Generate unique filename
5. Upload to Supabase Storage
6. Create database record in project_files
7. Return signed URL
8. Display in UI
```

### Download Flow

```
1. Client clicks download button
2. Server Action: getSignedUrl()
3. Supabase generates temporary URL (1 hour)
4. Browser downloads from signed URL
5. URL expires after 1 hour
```

### Security

- Files accessible only to:
  - Project client
  - Admin users
- Signed URLs required for download
- RLS policies on `project_files` table

---

## Real-time Architecture

### Supabase Realtime

**Subscriptions**:

1. **Notifications**:
```typescript
const channel = supabase
  .channel(`user-notifications-${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // New notification received
    setNotifications(prev => [payload.new, ...prev])
  })
  .subscribe()
```

2. **Messages**:
```typescript
const channel = supabase
  .channel(`project-messages-${projectId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'project_messages',
    filter: `project_id=eq.${projectId}`
  }, (payload) => {
    // New message received
    setMessages(prev => [...prev, payload.new])
  })
  .subscribe()
```

### Cleanup

```typescript
useEffect(() => {
  // Subscribe to channel
  const channel = supabase.channel(...)

  // Cleanup on unmount
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## Security Architecture

### Authentication

- ✅ HTTP-only session cookies
- ✅ Middleware route protection
- ✅ Server-side session validation
- ✅ CSRF protection (Next.js built-in)

### Authorization

- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access control (client/admin)
- ✅ Server action permission checks
- ✅ API route authorization

### Data Protection

- ✅ HTTPS enforced (Vercel)
- ✅ Environment variables secured
- ✅ Service role key server-side only
- ✅ Signed URLs for file access

### Webhook Security

- ✅ Stripe webhook signature verification
- ✅ Payload validation
- ✅ Idempotency handling

---

## Performance

### Optimizations Implemented

- ✅ Server Components for initial load
- ✅ Route-based code splitting
- ✅ Font optimization (Google Fonts)
- ✅ Realtime (WebSocket, no polling)
- ✅ Signed URLs for file access

### Future Optimizations

- [ ] Next.js Image component for all images
- [ ] Lazy loading for video grid
- [ ] Database query optimization
- [ ] CDN for static assets
- [ ] Edge caching

---

## Deployment

### Vercel Configuration

**Build Command**: `npm run build`
**Output Directory**: `.next`
**Framework**: Next.js 15

**Environment Variables**:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY

### CI/CD Pipeline

```
1. Push to GitHub
2. Vercel detects changes
3. Automatic build triggered
4. Type checking
5. Linting
6. Build Next.js app
7. Deploy to production
8. Health checks
```

---

## Monitoring

### Vercel Analytics (Optional)

- Page views
- Performance metrics
- Error tracking

### Logging

- Server action errors → console.error
- Webhook events → console.log
- Database errors → Supabase logs

### Health Checks

- Database connection
- Storage bucket access
- Stripe API status
- Resend API status

---

## Future Enhancements

### Phase 2 (Weeks 2-4)

- [ ] Vimeo Player integration
- [ ] Portfolio pages (/reel, /film, /edit, /shorts)
- [ ] Contact form with validation
- [ ] About page
- [ ] SEO optimization
- [ ] Performance optimization

### Phase 3 (Future)

- [ ] Google Calendar integration
- [ ] Video review/annotation tools
- [ ] E-signature integration (DocuSign)
- [ ] Advanced analytics dashboard
- [ ] Client onboarding automation
- [ ] Asset library/gallery

---

## System Statistics

### Current State (45% Complete)

**Frontend**:
- 25+ pages built
- 7 marketing components
- 15+ admin components
- Dual theme system
- Responsive design

**Backend**:
- 9 database tables
- 26 server actions
- 9 email templates
- Stripe integration
- Real-time subscriptions

**Features**:
- ✅ Authentication
- ✅ Client portal
- ✅ Admin portal
- ✅ Messaging
- ✅ Bookings
- ✅ Invoices
- ✅ File management
- ✅ Notifications
- ✅ Marketing site
- ⏳ Portfolio pages (in progress)

---

## Summary

Duke Studios is a modern, full-stack video production studio management platform built with:

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Supabase (Database, Auth, Storage, Realtime)
- **Payments**: Stripe (Invoices, Checkout, Webhooks)
- **Email**: Resend (9 React Email templates)
- **Hosting**: Vercel (Automatic deployments, Edge functions)

**Architecture Highlights**:
- Route groups for separation of concerns
- Dual theme system (light marketing, dark app)
- Server actions for type-safe mutations
- Real-time updates via WebSocket
- Row Level Security for data protection
- Professional email notifications
- Comprehensive CRM capabilities

**Status**: 45% complete, production-ready foundation

---

**Last Updated**: December 1, 2025
**Version**: 1.0
**Zorath LLC** | Duke Studios
