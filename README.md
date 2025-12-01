# Duke Studios

Production studio management platform for filmmaker Adisa Duke.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Supabase (Auth, Database, Storage, Realtime)
- Stripe (Payments & Invoices)
- TailwindCSS
- Framer Motion

## Features

### Client Portal
- Project dashboard and tracking
- Real-time messaging
- Booking requests
- Invoice viewing and payment
- File deliverables

### Admin Portal
- Client management
- Project pipeline
- Booking approvals
- Custom invoice creation
- File uploads
- Analytics dashboard

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account
- Resend account (for emails)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase, Stripe, and Resend credentials.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the Supabase migrations in `/supabase/migrations` to create the database schema.

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## License

Proprietary - Zorath LLC
