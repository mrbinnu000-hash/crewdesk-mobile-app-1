# CrewDesk Production Guide

Complete guide to deploy and run CrewDesk in production.

## 1. BEFORE YOU START

### What's Included
- ✅ Multi-tenant SaaS architecture (businesses completely isolated)
- ✅ Supabase authentication (email/password, email verification)
- ✅ Dashboard with real-time call analytics
- ✅ Lead management and scoring
- ✅ Secure Retell AI webhook integration
- ✅ Recording storage with signed URLs
- ✅ Notification system
- ✅ Settings persistence

### What You'll Need
1. **Supabase account** - Database, auth, storage (free tier works)
2. **Vercel account** - Hosting (or any Node.js host)
3. **Retell AI account** - Phone API integration
4. **Domain** (optional but recommended for production)

### Current Status
- Build: ✅ Passing
- TypeScript: ✅ No errors
- Supabase: Connected to new project `ewpfdrvtmqfbymrtriqj`
- Credentials: Updated in `.env.development.local`
- Ready: Run migrations below

---

## 2. SETUP SUPABASE DATABASE (DO THIS NOW)

### Step 1: Create Tables
1. Go to https://supabase.com/dashboard
2. Open your project: `ewpfdrvtmqfbymrtriqj` (URL: https://ewpfdrvtmqfbymrtriqj.supabase.co)
3. Click **SQL Editor** → **New Query**
4. Copy ALL of the SQL below and paste it:

```sql
-- Run this entire SQL block in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  call_id TEXT NOT NULL,
  phone_number TEXT,
  duration_seconds INTEGER DEFAULT 0,
  transcript TEXT,
  recording_url TEXT,
  call_analysis JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  customer_address TEXT,
  reason TEXT,
  qualified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  urgency TEXT DEFAULT 'low',
  follow_up_scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  qualified_leads BOOLEAN DEFAULT TRUE,
  urgent_callbacks BOOLEAN DEFAULT TRUE,
  daily_summaries BOOLEAN DEFAULT TRUE,
  missed_calls BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own business" ON public.businesses FOR SELECT USING (id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can view profiles in their business" ON public.profiles FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can view calls in their business" ON public.calls FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert calls in their business" ON public.calls FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update calls in their business" ON public.calls FOR UPDATE USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can view leads in their business" ON public.leads FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert leads in their business" ON public.leads FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update leads in their business" ON public.leads FOR UPDATE USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can view notifications in their business" ON public.notifications FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update notification read status" ON public.notifications FOR UPDATE USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert notifications in their business" ON public.notifications FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can update their own preferences" ON public.notification_preferences FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own preferences" ON public.notification_preferences FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can view follow-ups in their business" ON public.follow_ups FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert follow-ups in their business" ON public.follow_ups FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update follow-ups in their business" ON public.follow_ups FOR UPDATE USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can view analytics in their business" ON public.analytics_events FOR SELECT USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert analytics in their business" ON public.analytics_events FOR INSERT WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON public.profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_calls_business_id ON public.calls(business_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_business_id ON public.leads(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_business_id ON public.notifications(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(unread);
CREATE INDEX IF NOT EXISTS idx_follow_ups_business_id ON public.follow_ups(business_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_business_id ON public.analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON public.calls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON public.follow_ups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ DECLARE business_id UUID; BEGIN
  INSERT INTO public.businesses (name) VALUES (COALESCE(new.raw_user_meta_data->>'business_name', 'My Business')) RETURNING id INTO business_id;
  INSERT INTO public.profiles (id, business_id, first_name, is_admin) VALUES (new.id, business_id, COALESCE(new.raw_user_meta_data->>'first_name', 'User'), TRUE);
  INSERT INTO public.notification_preferences (profile_id) VALUES (new.id);
  RETURN new;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

5. Click **Run** and wait for completion (30 seconds max)

### Step 2: Verify Tables Created
1. Click **Table Editor** in left sidebar
2. You should see 8 tables created:
   - `businesses` ✅
   - `profiles` ✅
   - `calls` ✅
   - `leads` ✅
   - `notifications` ✅
   - `notification_preferences` ✅
   - `follow_ups` ✅
   - `analytics_events` ✅

### Step 3: Enable Storage Bucket (for recordings)
1. In Supabase, go to **Storage** → **New Bucket**
2. Create bucket named: `recordings`
3. Set privacy to **PRIVATE**
4. Leave policies as-is (code handles access)

---

## 3. TEST LOCALLY

### Run Dev Server
```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Sign Up (Create Test Account)
1. Click **Sign Up**
2. Enter:
   - Business Name: `CrewDesk Test`
   - Email: Any email
   - Password: Anything (8+ chars)
3. Confirm email (check Supabase auth if no email service)
4. Login with those credentials

### Verify Everything Works
1. Dashboard should load
2. Go to Settings
3. Add your Retell Agent ID (optional for now)
4. All pages should be accessible

---

## 4. ENVIRONMENT VARIABLES

### Your Current Variables (Already Set)
Development: `.env.development.local` ✅

```
NEXT_PUBLIC_SUPABASE_URL=https://ewpfdrvtmqfbymrtriqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cGZkcnZ0bXFmYnltcnRyaXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjIyNzUsImV4cCI6MjA5OTY5ODI3NX0.RRdM6a3MRZLLMwAdOj8KHhjWNDEZbEAFM_2kCY3aUYU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cGZkcnZ0bXFmYnltcnRyaXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyMjI3NSwiZXhwIjoyMDk5Njk4Mjc1fQ.AldkRs80B9tlzrUfwpb852vYfaTQPXcMV8hs4No4kDw
RETELL_API_KEY=key_3f3a793e6bacc561da698796cb07
```

### For Production Deployment (Copy to Vercel)
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add these variables (same values as above):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RETELL_API_KEY`

### Optional (for Webhook Security)
```
RETELL_WEBHOOK_SECRET=your-secret-here
```

---

## 5. SETUP RETELL WEBHOOK

### Step 1: Get Your Vercel URL
After deploying to Vercel, your app will be at: `https://your-project.vercel.app`

### Step 2: Configure Webhook
1. Go to https://dashboard.retellai.com
2. Navigate to **Integrations** → **Webhooks**
3. Set webhook URL to: `https://your-project.vercel.app/api/webhooks/retell`
4. Select events: **Call Completed**
5. Add header `x-retell-signature` with your secret (if using RETELL_WEBHOOK_SECRET)

### Step 3: Test Webhook
1. Make a test call through Retell
2. Check Supabase: Should see new record in `calls` table
3. If call was qualified, should see new `leads` record

---

## 6. DEPLOY TO VERCEL

### One-Click Deploy
1. Go to https://vercel.com and connect your GitHub repo
2. Select this project
3. Add environment variables from section 4
4. Click **Deploy**

### Manual Deploy
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 7. CREATE FIRST CUSTOMER ACCOUNT

### New Customer Signup Flow
1. Customer visits your app at `https://your-project.vercel.app`
2. Clicks **Sign Up**
3. Enters: Business name, email, password
4. Confirms email
5. Auto-created in `businesses` and `users` tables
6. Ready to receive calls

---

## 8. ADDING CUSTOMERS TO RETELL

### For Each Customer
1. In Retell dashboard, create Agent
2. Set Agent phone number
3. Configure prompts/behavior
4. Get Agent ID

### Link to Dashboard
1. Customer logs into CrewDesk
2. Goes to **Settings**
3. Pastes Retell Agent ID
4. Saves

Now calls → webhook → auto-populate dashboard

---

## 9. MONITORING IN PRODUCTION

### Check Supabase Realtime
1. Open Supabase → **Table Editor**
2. Click `calls` table
3. See new calls appearing in real-time

### Check Logs
1. Vercel dashboard → Your project → **Logs**
2. Look for `[CrewDesk]` messages
3. Watch webhook receipts

### Common Issues

**"Failed to connect to database"**
- Check env vars in Vercel are correct
- Verify Supabase tables exist
- Check RLS policies aren't blocking

**"Webhook returned 401"**
- Verify `RETELL_WEBHOOK_SECRET` matches Retell config
- Check webhook URL is correct

**No calls appearing**
- Verify Retell Agent is connected
- Check webhook fired (Retell dashboard logs)
- Check Supabase for call records

---

## 10. SCALING CHECKLIST

### When You Get Busy
- [ ] Add Redis for caching (Upstash)
- [ ] Add async job queue (Bull/Redis)
- [ ] Move webhook processing to async
- [ ] Add CDN for static assets (Vercel default)
- [ ] Monitor DB performance (Supabase Analytics)

### Security Hardening
- [ ] Enable 2FA on Supabase
- [ ] Rotate API keys quarterly
- [ ] Enable RLS enforcement
- [ ] Add rate limiting on API routes
- [ ] Log all auth events

---

## 11. QUICK REFERENCE

### URLs
- **App**: https://your-project.vercel.app
- **Supabase**: https://supabase.com/dashboard
- **Retell**: https://dashboard.retellai.com

### Key Files
- Database schema: `lib/migrations/001_init.sql`
- Auth routes: `app/auth/login/page.tsx`, `sign-up/page.tsx`
- Webhook: `app/api/webhooks/retell/route.ts`
- Dashboard: `app/(app)/dashboard/page.tsx`
- API routes: `app/api/*/route.ts`

### Environment Variables Location
- **Development**: `.env.development.local`
- **Production**: Vercel project settings → Environment Variables

---

## 12. SUPPORT

### If Something Breaks

1. Check Vercel logs for errors
2. Check Supabase for data
3. Verify env vars are set
4. Check webhook is hitting your URL
5. Restart: `vercel redeploy`

### Common Errors
- "SUPABASE_URL not configured" → Check env vars
- "Invalid credentials" → Check email/password
- "Webhook signature invalid" → Check RETELL_WEBHOOK_SECRET
- "RLS policy violation" → Check Supabase RLS policies

---

## 13. GOING LIVE CHECKLIST

Before accepting paying customers:

- [ ] Supabase tables created and verified
- [ ] Test user can login and see dashboard
- [ ] Webhook URL configured in Retell
- [ ] Made test call to verify flow
- [ ] Environment variables set in Vercel
- [ ] SSL certificate working (Vercel default)
- [ ] Custom domain configured (optional)
- [ ] Backup plan documented
- [ ] Support email setup
- [ ] First customer test completed

---

## 14. NEXT FEATURES (PHASE 2)

After MVP launch, add:
- Push notifications (Firebase Cloud Messaging)
- Advanced analytics (charts, trends)
- AI call transcription (Retell integration)
- Call quality scoring
- Competitor pricing integration
- Team management
- White-label option

---

**You're ready to go live. Start with Step 2 (Setup Supabase Database) now.**
