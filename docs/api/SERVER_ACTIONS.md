# Duke Studios - Server Actions Documentation

Complete reference for all server actions in the Duke Studios platform. Server actions handle data mutations, backend logic, and email notifications.

**Location**: `app/actions/`
**Total Actions**: 6 files
**Pattern**: Server-side only, async functions

---

## Overview

Server actions are server-side functions that handle:
- Data mutations (create, update, delete)
- Database operations via Supabase
- File uploads to Supabase Storage
- Email notifications via Resend
- Business logic and validation

**Benefits**:
- Type-safe with TypeScript
- Direct database access
- Server-side only (secure)
- Automatic error handling
- Easy to call from client components

---

## Action Files Index

1. [auth.ts](#1-authentication-actions) - Authentication operations
2. [bookings.ts](#2-booking-actions) - Booking management
3. [files.ts](#3-file-actions) - File upload/download
4. [invoices.ts](#4-invoice-actions) - Invoice management
5. [messages.ts](#5-message-actions) - Messaging system
6. [notifications.ts](#6-notification-actions) - Notification management
7. [projects.ts](#7-project-actions) - Project management

---

## 1. Authentication Actions

**File**: `app/actions/auth.ts`

### signIn

**Purpose**: Authenticate user with email and password

**Signature**:
```typescript
export async function signIn(email: string, password: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
import { signIn } from '@/app/actions/auth'

const result = await signIn('user@example.com', 'password123')
if (result.success) {
  // Redirect to dashboard
} else {
  // Show error: result.error
}
```

**Implementation**:
- Validates email and password
- Uses Supabase Auth `signInWithPassword`
- Returns success/error object
- Sets session cookie

### signUp

**Purpose**: Create new user account

**Signature**:
```typescript
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: 'client' | 'admin'
): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
const result = await signUp(
  'newuser@example.com',
  'password123',
  'John Doe',
  'client'
)
```

**Implementation**:
- Creates user in Supabase Auth
- Creates profile in `users` table
- Sends welcome email via Resend
- Sends email verification link

### signOut

**Purpose**: Log out current user

**Signature**:
```typescript
export async function signOut(): Promise<{ success: boolean }>
```

**Usage**:
```typescript
await signOut()
// Redirect to homepage
```

### requestPasswordReset

**Purpose**: Send password reset email

**Signature**:
```typescript
export async function requestPasswordReset(email: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await requestPasswordReset('user@example.com')
// Shows success message
```

### updatePassword

**Purpose**: Update user password

**Signature**:
```typescript
export async function updatePassword(newPassword: string): Promise<{
  success: boolean
  error?: string
}>
```

---

## 2. Booking Actions

**File**: `app/actions/bookings.ts`

### createBooking

**Purpose**: Client creates a booking request

**Signature**:
```typescript
export async function createBooking(data: {
  serviceType: string
  desiredDate: string
  message: string
  budget?: string
}): Promise<{
  success: boolean
  bookingId?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await createBooking({
  serviceType: 'Commercial Video Production',
  desiredDate: '2025-12-15',
  message: 'Looking to shoot a 60-second commercial...',
  budget: '$5,000 - $10,000'
})
```

**Implementation**:
- Gets current user from session
- Creates booking in `bookings` table
- Creates notification for admin
- Sends booking confirmation email to client
- Returns booking ID

**Database**:
```sql
INSERT INTO bookings (
  client_id,
  service_type,
  desired_date,
  message,
  budget,
  status
) VALUES (?, ?, ?, ?, ?, 'pending')
```

### approveBooking

**Purpose**: Admin approves a booking and creates project

**Signature**:
```typescript
export async function approveBooking(bookingId: string): Promise<{
  success: boolean
  projectId?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await approveBooking('booking-uuid')
if (result.success) {
  console.log('Project created:', result.projectId)
}
```

**Implementation**:
1. Verifies user is admin
2. Gets booking details
3. Creates project from booking
4. Updates booking status to 'approved'
5. Creates notification for client
6. Sends booking approved email
7. Returns project ID

**Email Sent**: BookingConfirmedEmail with project link

### declineBooking

**Purpose**: Admin declines a booking request

**Signature**:
```typescript
export async function declineBooking(
  bookingId: string,
  reason: string
): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await declineBooking(
  'booking-uuid',
  'Unfortunately, we are fully booked during this period.'
)
```

**Implementation**:
1. Verifies user is admin
2. Updates booking status to 'declined'
3. Saves decline reason
4. Creates notification for client
5. Sends decline email with reason

**Email Sent**: BookingDeclinedEmail with reason

---

## 3. File Actions

**File**: `app/actions/files.ts`

### uploadFile

**Purpose**: Upload file to project

**Signature**:
```typescript
export async function uploadFile(
  projectId: string,
  file: File,
  description?: string,
  isFinal?: boolean
): Promise<{
  success: boolean
  fileId?: string
  fileUrl?: string
  error?: string
}>
```

**Usage**:
```typescript
const file = event.target.files[0]
const result = await uploadFile(
  'project-uuid',
  file,
  'Final edit v2',
  true // Mark as final deliverable
)
```

**Implementation**:
1. Validates file size and type
2. Generates unique filename
3. Uploads to Supabase Storage (`project_files` bucket)
4. Creates file record in `project_files` table
5. Creates notification for client
6. Sends file upload email if final
7. Returns file URL and ID

**Storage Path**:
```
project_files/{projectId}/{timestamp}_{originalName}
```

### deleteFile

**Purpose**: Delete file from project

**Signature**:
```typescript
export async function deleteFile(fileId: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await deleteFile('file-uuid')
```

**Implementation**:
1. Gets file record
2. Deletes from Supabase Storage
3. Deletes record from `project_files` table
4. Verifies user has permission

### markFileAsFinal

**Purpose**: Mark file as final deliverable

**Signature**:
```typescript
export async function markFileAsFinal(fileId: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await markFileAsFinal('file-uuid')
```

**Implementation**:
1. Updates `is_final` to true
2. Creates notification
3. Sends delivery email to client

**Email Sent**: NewFileEmail with download link

### getSignedUrl

**Purpose**: Get temporary signed URL for file download

**Signature**:
```typescript
export async function getSignedUrl(filePath: string): Promise<{
  url?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await getSignedUrl('project_files/abc123/video.mp4')
// Use result.url for download link (expires in 1 hour)
```

**Implementation**:
- Generates signed URL via Supabase Storage
- URL expires in 3600 seconds (1 hour)
- Secure access without exposing storage

---

## 4. Invoice Actions

**File**: `app/actions/invoices.ts`

### createInvoice

**Purpose**: Admin creates invoice for project

**Signature**:
```typescript
export async function createInvoice(data: {
  projectId: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  dueDate?: string
  notes?: string
  depositPercentage?: number
}): Promise<{
  success: boolean
  invoiceId?: string
  stripeInvoiceId?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await createInvoice({
  projectId: 'project-uuid',
  lineItems: [
    { description: 'Video Production', quantity: 1, unitPrice: 5000 },
    { description: 'Color Grading', quantity: 1, unitPrice: 1500 }
  ],
  dueDate: '2025-12-31',
  depositPercentage: 50
})
```

**Implementation**:
1. Verifies user is admin
2. Calculates total amount
3. Creates Stripe invoice
4. Creates invoice in `invoices` table
5. Creates notification for client
6. Sends invoice email
7. Returns invoice ID and Stripe invoice ID

**Stripe Integration**:
```typescript
const stripeInvoice = await stripe.invoices.create({
  customer: stripeCustomerId,
  description: `Invoice for ${projectName}`,
  metadata: { projectId, invoiceId },
})
```

**Email Sent**: NewInvoiceEmail with payment link

### updateInvoiceStatus

**Purpose**: Update invoice status (called by webhook)

**Signature**:
```typescript
export async function updateInvoiceStatus(
  invoiceId: string,
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled'
): Promise<{
  success: boolean
  error?: string
}>
```

**Usage** (typically from webhook):
```typescript
// In Stripe webhook handler
await updateInvoiceStatus(invoiceId, 'paid')
```

**Implementation**:
1. Updates invoice status
2. Updates paid_at if status is 'paid'
3. Creates notification
4. Sends payment confirmation email if paid

### getInvoicePaymentUrl

**Purpose**: Get Stripe Checkout URL for invoice payment

**Signature**:
```typescript
export async function getInvoicePaymentUrl(invoiceId: string): Promise<{
  url?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await getInvoicePaymentUrl('invoice-uuid')
// Redirect to result.url for payment
```

**Implementation**:
- Creates Stripe Checkout session
- Returns checkout URL
- Redirects back to invoice page after payment

---

## 5. Message Actions

**File**: `app/actions/messages.ts`

### sendMessage

**Purpose**: Send message in project thread

**Signature**:
```typescript
export async function sendMessage(
  projectId: string,
  content: string
): Promise<{
  success: boolean
  messageId?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await sendMessage(
  'project-uuid',
  'The latest edit looks great! Just one small change...'
)
```

**Implementation**:
1. Gets current user
2. Creates message in `project_messages` table
3. Determines recipient (admin if sent by client, vice versa)
4. Creates notification for recipient
5. Sends email notification
6. Returns message ID

**Real-time**: Message appears instantly via Supabase Realtime subscription

**Email Sent**: NewMessageEmail with message preview

### markMessageAsRead

**Purpose**: Mark message as read

**Signature**:
```typescript
export async function markMessageAsRead(messageId: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await markMessageAsRead('message-uuid')
```

**Implementation**:
- Updates `read_at` timestamp
- Only if user is recipient

### getProjectMessages

**Purpose**: Get all messages for a project

**Signature**:
```typescript
export async function getProjectMessages(projectId: string): Promise<{
  messages: Message[]
  error?: string
}>
```

**Usage**:
```typescript
const result = await getProjectMessages('project-uuid')
const messages = result.messages
```

**Implementation**:
- Fetches messages ordered by created_at
- Includes sender information
- Verifies user has access to project

---

## 6. Notification Actions

**File**: `app/actions/notifications.ts`

### createNotification

**Purpose**: Create notification for user

**Signature**:
```typescript
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<{
  success: boolean
  notificationId?: string
  error?: string
}>
```

**Usage**:
```typescript
await createNotification(
  'user-uuid',
  'project_update',
  'Project Status Updated',
  'Your project is now in editing phase',
  '/projects/project-uuid'
)
```

**Implementation**:
- Creates notification in `notifications` table
- Notification appears in real-time via subscription
- Returns notification ID

**Notification Types**:
- `booking_request`
- `booking_approved`
- `booking_declined`
- `project_update`
- `new_message`
- `new_file`
- `invoice_created`
- `payment_received`

### markNotificationAsRead

**Purpose**: Mark notification as read

**Signature**:
```typescript
export async function markNotificationAsRead(notificationId: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await markNotificationAsRead('notification-uuid')
```

**Implementation**:
- Updates `read_at` timestamp
- Real-time update via subscription

### markAllNotificationsAsRead

**Purpose**: Mark all user notifications as read

**Signature**:
```typescript
export async function markAllNotificationsAsRead(): Promise<{
  success: boolean
  count?: number
  error?: string
}>
```

**Usage**:
```typescript
const result = await markAllNotificationsAsRead()
console.log(`Marked ${result.count} notifications as read`)
```

### deleteNotification

**Purpose**: Delete notification

**Signature**:
```typescript
export async function deleteNotification(notificationId: string): Promise<{
  success: boolean
  error?: string
}>
```

---

## 7. Project Actions

**File**: `app/actions/projects.ts`

### createProject

**Purpose**: Admin creates new project

**Signature**:
```typescript
export async function createProject(data: {
  clientId: string
  name: string
  description?: string
  deadline?: string
  budget?: number
}): Promise<{
  success: boolean
  projectId?: string
  error?: string
}>
```

**Usage**:
```typescript
const result = await createProject({
  clientId: 'client-uuid',
  name: 'Nike Air Max Campaign',
  description: '60-second commercial',
  deadline: '2025-12-31',
  budget: 10000
})
```

**Implementation**:
1. Verifies user is admin
2. Creates project in `projects` table
3. Creates notification for client
4. Sends project created email
5. Returns project ID

### updateProjectStatus

**Purpose**: Update project status

**Signature**:
```typescript
export async function updateProjectStatus(
  projectId: string,
  status: 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'
): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await updateProjectStatus('project-uuid', 'editing')
```

**Implementation**:
1. Updates project status
2. Creates notification for client
3. Sends status update email

**Email Sent**: ProjectStatusEmail with new status

**Status Flow**:
```
pending → pre_production → shooting → editing → review → delivered
```

### updateProject

**Purpose**: Update project details

**Signature**:
```typescript
export async function updateProject(
  projectId: string,
  updates: {
    name?: string
    description?: string
    deadline?: string
    budget?: number
  }
): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await updateProject('project-uuid', {
  deadline: '2026-01-15',
  budget: 12000
})
```

### deleteProject

**Purpose**: Delete project (soft delete)

**Signature**:
```typescript
export async function deleteProject(projectId: string): Promise<{
  success: boolean
  error?: string
}>
```

**Usage**:
```typescript
await deleteProject('project-uuid')
```

**Implementation**:
- Marks project as deleted (soft delete)
- Does not delete associated files/messages
- Only admin can delete

---

## Common Patterns

### Error Handling

All actions follow this pattern:

```typescript
try {
  // Operation
  return { success: true, data }
} catch (error) {
  console.error('Action error:', error)
  return {
    success: false,
    error: error.message || 'An error occurred'
  }
}
```

### Authentication Check

```typescript
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  return { success: false, error: 'Not authenticated' }
}
```

### Admin Check

```typescript
const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  return { success: false, error: 'Admin access required' }
}
```

### Database Insert Pattern

```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({
    field1: value1,
    field2: value2,
  })
  .select()
  .single()

if (error) throw error
```

---

## Email Integration

### Email Triggers

Actions automatically send emails via Resend:

| Action | Email Template | Recipient |
|--------|---------------|-----------|
| signUp | WelcomeEmail | New user |
| approveBooking | BookingConfirmedEmail | Client |
| declineBooking | BookingDeclinedEmail | Client |
| createInvoice | NewInvoiceEmail | Client |
| updateInvoiceStatus (paid) | PaymentReceivedEmail | Client |
| sendMessage | NewMessageEmail | Recipient |
| markFileAsFinal | NewFileEmail | Client |
| updateProjectStatus | ProjectStatusEmail | Client |

### Email Helper

```typescript
import { sendEmail } from '@/lib/email/send'

await sendEmail({
  to: user.email,
  subject: 'Notification',
  template: <EmailTemplate data={data} />,
})
```

---

## Real-time Integration

### Notification Creation

When actions create notifications, they appear in real-time:

```typescript
// In action
await createNotification(userId, ...)

// Client receives via subscription
useRealtimeNotifications(userId)
```

### Message Creation

Messages appear instantly in the UI:

```typescript
// In action
await sendMessage(projectId, content)

// Client receives via subscription
useRealtimeMessages(projectId)
```

---

## Security

### Row Level Security (RLS)

All database operations respect RLS policies:

- **Clients**: Can only access their own projects, messages, files
- **Admins**: Can access all data
- **Unauthenticated**: No access

### Permission Checks

Actions verify permissions before operations:

```typescript
// Check project access
const { data: project } = await supabase
  .from('projects')
  .select('client_id')
  .eq('id', projectId)
  .single()

if (project.client_id !== user.id && userRole !== 'admin') {
  return { success: false, error: 'Access denied' }
}
```

---

## Testing

### Example Test

```typescript
import { createBooking } from '@/app/actions/bookings'

describe('createBooking', () => {
  it('creates a booking successfully', async () => {
    const result = await createBooking({
      serviceType: 'Video Production',
      desiredDate: '2025-12-15',
      message: 'Test booking'
    })

    expect(result.success).toBe(true)
    expect(result.bookingId).toBeDefined()
  })

  it('returns error if not authenticated', async () => {
    // Mock unauthenticated state
    const result = await createBooking({...})

    expect(result.success).toBe(false)
    expect(result.error).toBe('Not authenticated')
  })
})
```

---

## Best Practices

### DO's

✅ **Always return success/error object**
```typescript
return { success: true, data }
return { success: false, error: 'Message' }
```

✅ **Validate inputs**
```typescript
if (!email || !password) {
  return { success: false, error: 'Email and password required' }
}
```

✅ **Log errors**
```typescript
catch (error) {
  console.error('Action failed:', error)
}
```

✅ **Use transactions for multi-step operations**
```typescript
// Use Supabase transactions when needed
```

### DON'Ts

❌ **Don't expose sensitive data in errors**
```typescript
// Bad
return { error: error.message } // Might expose DB structure

// Good
return { error: 'An error occurred' }
```

❌ **Don't skip authentication checks**
```typescript
// Always verify user first
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { error: 'Not authenticated' }
```

❌ **Don't perform client-side operations**
```typescript
// Server actions should only run on server
// No window, document, or browser APIs
```

---

## Future Enhancements

### Planned Actions

- [ ] `calendar.ts` - Google Calendar integration
- [ ] `analytics.ts` - Analytics data actions
- [ ] `search.ts` - Global search functionality
- [ ] `exports.ts` - Data export actions
- [ ] `webhooks.ts` - Third-party webhook management

### Improvements

- [ ] Add action rate limiting
- [ ] Add action logging/audit trail
- [ ] Add action retry logic
- [ ] Add batch operations
- [ ] Add action middleware

---

## Summary

**Server Actions Implemented**:
- ✅ Authentication (5 actions)
- ✅ Bookings (3 actions)
- ✅ Files (4 actions)
- ✅ Invoices (3 actions)
- ✅ Messages (3 actions)
- ✅ Notifications (4 actions)
- ✅ Projects (4 actions)

**Total**: ~26 server actions

**Patterns**:
- Type-safe with TypeScript
- Consistent error handling
- Authentication checks
- Email integration
- Real-time updates
- RLS security

**Status**: ✅ Production ready

---

**Last Updated**: December 1, 2025
**Version**: 1.0
**Zorath LLC** | Duke Studios
