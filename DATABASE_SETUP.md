# Duke Studios - Database Setup Instructions

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/lkvqhdmmjeauopdwfuiq
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

## Step 2: Run Database Migration

Copy the ENTIRE contents of the file below and paste it into the SQL Editor:

**File:** `supabase/migrations/20241201000000_init_schema.sql`

**Location:** `C:\Users\Luis\Documents\adisaduke\supabase\migrations\20241201000000_init_schema.sql`

## Step 3: Execute the Migration

1. After pasting the SQL code, click **Run** (or press Ctrl+Enter)
2. Wait for the query to complete (should take 5-10 seconds)
3. You should see: **Success. No rows returned**

## Step 4: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should see 9 tables:
   - users
   - projects
   - project_messages
   - project_files
   - invoices
   - payments
   - bookings
   - client_notes
   - notifications

## What This Migration Creates

### Tables (9 total)
- **users** - User accounts (admin/client roles)
- **projects** - Production projects with status tracking
- **project_messages** - Real-time messaging per project
- **project_files** - File deliverables with versioning
- **invoices** - Stripe-integrated invoices
- **payments** - Payment tracking and history
- **bookings** - Client booking requests
- **client_notes** - Admin-only client notes
- **notifications** - Real-time notifications

### Security (Row Level Security)
- All tables have RLS policies enabled
- Clients can only see their own data
- Admins have full access to all data
- Secure data isolation

### Database Functions
- `update_updated_at_column()` - Auto-update timestamps
- `handle_new_user()` - Auto-create user profiles on signup

### Triggers
- Auto-update `updated_at` fields on edits
- Auto-create user profile when account is created

## Troubleshooting

### Error: "relation already exists"
- Tables already exist, migration already ran
- Safe to ignore or drop tables and re-run

### Error: "permission denied"
- Make sure you're logged in as project owner
- Check you're on the correct project

### Error: "syntax error"
- Make sure you copied the ENTIRE SQL file
- Don't modify the SQL code

## After Migration Completes

Your database is ready! The platform can now:
- ✅ Create user accounts
- ✅ Store projects and client data
- ✅ Handle messages and file uploads
- ✅ Process invoices and payments
- ✅ Manage bookings and notifications

## Next Steps

After running the migration:
1. Verify Vercel deployment is working (https://duke-studios.vercel.app)
2. Test user signup/login
3. Begin building authentication pages
4. Build client and admin dashboards
