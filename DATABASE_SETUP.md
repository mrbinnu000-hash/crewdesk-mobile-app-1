# CrewDesk Database Setup Guide

## Step 1: Create the Database Schema

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `/lib/schema.sql` from this project
6. Paste it into the SQL editor
7. Click **Run** to execute

The schema will create:
- `profiles` - User profiles extending auth.users
- `calls` - Call records with transcripts and recordings
- `leads` - Leads generated from calls
- `notifications` - In-app notifications
- `analytics_events` - Event tracking for analytics

All tables have Row Level Security (RLS) enabled to protect user data.

## Step 2: Verify Environment Variables

Make sure these are set in your project:
- `SUPABASE_PROJECT_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `RETELL_API_KEY` - Your Retell API key

## Step 3: Start Using the API

The backend is ready to use. See `API_ROUTES.md` for endpoint documentation.
