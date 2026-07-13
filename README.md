# CrewDesk - AI Receptionist Platform

A complete, production-ready AI receptionist platform built with Next.js 16, Supabase, and Retell AI. Designed for businesses to automate call handling and lead generation.

## Features

- **AI Call Handling**: Retell AI integration for intelligent call routing and qualification
- **Lead Management**: Automatic lead capture and status tracking from qualified calls
- **Real-time Notifications**: Instant alerts for qualified leads and urgent callbacks
- **Analytics Dashboard**: Comprehensive call metrics, conversion rates, and performance tracking
- **Agent Management**: Multi-agent system with individual performance tracking
- **Call Recordings**: Store and access call transcripts and recordings
- **Mobile-First UI**: Responsive design optimized for mobile agents

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase PostgreSQL with Row Level Security
- **AI Integration**: Retell AI for call handling
- **Authentication**: Supabase Auth (Email + Password)
- **Deployment**: Vercel

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Supabase account
- Retell AI account with API key

### 2. Setup Database

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete instructions.

Run the SQL schema from `/lib/schema.sql` in your Supabase dashboard.

### 3. Environment Variables

Add to your project:

```
SUPABASE_PROJECT_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
RETELL_API_KEY=xxxxx
```

### 4. Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete backend setup guide
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database schema and setup
- **[API_ROUTES.md](./API_ROUTES.md)** - API endpoint documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production and onboard clients

## Project Structure

```
/app
  /api
    /calls              - Call management endpoints
    /leads              - Lead management endpoints
    /analytics          - Analytics dashboard data
    /notifications      - Notification endpoints
    /webhooks/retell    - Retell AI webhook handler
  /auth                 - Authentication pages
  /(app)
    /dashboard          - Main dashboard
    /leads              - Leads list and detail
    /notifications      - Notifications page
    /analytics          - Analytics dashboard
    /settings           - User settings
/lib
  /supabase             - Supabase client setup
  schema.sql            - Database schema
/components
  bottom-nav.tsx        - Mobile navigation
  notifications.tsx     - Notification component
```

## API Endpoints

### Calls
- `GET /api/calls` - Get all calls
- `POST /api/calls` - Create a call

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a lead

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark as read
- `POST /api/notifications` - Create notification

### Analytics
- `GET /api/analytics/dashboard` - Get analytics data

### Webhooks
- `POST /api/webhooks/retell` - Retell webhook handler

See [API_ROUTES.md](./API_ROUTES.md) for full documentation.

## Database Schema

### Core Tables
- **profiles** - User profiles extending auth.users
- **calls** - Call records with transcripts and recordings
- **leads** - Generated leads from qualified calls
- **notifications** - In-app notifications
- **analytics_events** - Event tracking

All tables use Row Level Security (RLS) for data protection.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment and client onboarding guide.

Quick deploy:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## For Clients

### Sign Up

Clients visit: `https://yourdomain.com/auth/sign-up`

They can create accounts with email + password.

### Use the Platform

1. **Dashboard** - Overview of calls and activity
2. **Leads** - View all generated leads with customer info
3. **Notifications** - Real-time alerts for qualified leads
4. **Analytics** - Track performance metrics

## Security

- All data protected by Row Level Security (RLS)
- HTTPS required in production
- API keys never exposed to client
- Session-based authentication
- Rate limiting recommended for production

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Retell AI Docs**: https://docs.retellai.com
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## License

This project is licensed under the MIT License.
