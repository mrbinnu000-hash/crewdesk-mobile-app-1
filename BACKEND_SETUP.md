# CrewDesk Backend Setup Guide

This guide walks you through setting up the complete backend for CrewDesk to onboard clients.

## Prerequisites

- Supabase account with a project
- Retell AI account with API key
- Next.js 16 app (already set up)

## Step 1: Run Database Schema

1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire contents of `/lib/schema.sql`
5. Paste into the SQL editor and click **Run**

This creates:
- `profiles` - User profiles
- `calls` - Call records with transcripts
- `leads` - Generated leads from calls
- `notifications` - In-app notifications
- `analytics_events` - Event tracking

**Verify:** Go to **Table Editor** and confirm all tables appear.

## Step 2: Verify Environment Variables

Check that these are set in your project settings:

```
SUPABASE_PROJECT_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
RETELL_API_KEY=xxxxx
```

If not set, go to **Settings** → **Vars** and add them.

## Step 3: Start the Development Server

```bash
pnpm dev
```

The app will run at `http://localhost:3000`

## Step 4: Create a Test User

1. Navigate to http://localhost:3000/auth/sign-up
2. Create an account with email + password
3. Confirm your email (check the Supabase auth emails)
4. You're now logged in!

## Step 5: Test the Backend

### Test Call Creation

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -H "Cookie: supabase-auth=<your_session_token>" \
  -d '{
    "caller_phone_number": "+1234567890",
    "caller_name": "Test Caller",
    "status": "completed"
  }'
```

### Test Lead Creation

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "Cookie: supabase-auth=<your_session_token>" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "service_type": "roof replacement",
    "qualified": true
  }'
```

### Test Analytics

Navigate to http://localhost:3000/analytics to view the dashboard.

### Test Notifications

Navigate to http://localhost:3000/notifications to view all notifications.

## Step 6: Integrate Retell Webhooks

### Setup Webhook URL

1. Go to your Retell Dashboard
2. Navigate to **Settings** → **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhooks/retell`
4. Select events:
   - `call_started`
   - `call_ended`
   - `call_analyzed`

### Local Testing with Retell

For local development, use a tunneling service:

```bash
# Using ngrok
ngrok http 3000

# Your URL will be something like: https://abc123.ngrok.io
# Use this as your webhook URL in Retell Dashboard
```

## Step 7: Customize for Your Brand

1. Update company name in layouts and emails
2. Customize notification messages in `/app/api/webhooks/retell/route.ts`
3. Update analytics calculations in `/app/api/analytics/dashboard/route.ts`
4. Add your branding colors and logo

## Database Schema Overview

### profiles
- Extends Supabase `auth.users`
- Stores user metadata and role
- RLS enabled: users can only see their own profile

### calls
- All incoming/outgoing calls
- Stores: duration, transcript, recording URL, call analysis
- RLS enabled: agents only see their own calls

### leads
- Generated from qualified calls
- Stores: customer info, service type, status, notes
- RLS enabled: agents only see their own leads

### notifications
- In-app notifications for agents
- Types: qualified, urgent, summary, handled, daily
- RLS enabled: users only see their own notifications

### analytics_events
- Event tracking for detailed analytics
- Stores: event type and event data (JSON)
- RLS enabled: agents only see their own events

## API Endpoints

See `/API_ROUTES.md` for complete endpoint documentation.

### Core Endpoints

- `GET /api/calls` - Get all calls
- `POST /api/calls` - Create a call
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a lead
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark as read
- `GET /api/analytics/dashboard` - Get analytics

## Security

- All endpoints require authentication via Supabase
- Row Level Security (RLS) prevents data leakage
- Rate limiting recommended for production
- HTTPS required for production
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client

## Troubleshooting

### "Unauthorized" Error
- Check that you're logged in
- Verify session cookies are set
- Check RLS policies in Supabase

### "Webhook Failed"
- Verify webhook URL is correct
- Check Retell API key is valid
- Review webhook logs in Retell Dashboard

### "No calls showing up"
- Ensure calls are created via API or webhooks
- Check agent_id matches current user
- Verify RLS policies are correct

### Database Connection Issues
- Verify environment variables are set
- Check Supabase project is active
- Ensure network access is allowed

## Next Steps for Production

1. Deploy to Vercel: `vercel deploy`
2. Set production environment variables in Vercel dashboard
3. Enable HTTPS (automatic on Vercel)
4. Set up email notifications
5. Configure backup strategy
6. Add monitoring and logging
7. Set up customer support email
8. Create client onboarding documentation

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Retell**: https://docs.retellai.com
- **Next.js**: https://nextjs.org/docs
