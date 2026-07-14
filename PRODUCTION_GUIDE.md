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
- Supabase: Already connected (credentials in `.env.development.local`)
- Test user: Already created (support@crewdesk.in / H@rSh@311205)

---

## 2. SETUP SUPABASE DATABASE (DO THIS NOW)

### Step 1: Create Tables
1. Go to https://supabase.com/dashboard
2. Open your project: `qbgfkqfyqdcjcdvllirv`
3. Click **SQL Editor** → **New Query**
4. Copy the entire contents from `/lib/migrations/001_init.sql`
5. Click **Run**
6. Wait for completion (should take <10 seconds)
7. Repeat for `/lib/migrations/002_recording_storage.sql` and `/003_notification_preferences.sql`

### Step 2: Verify Tables Created
1. Click **Table Editor** in Supabase
2. You should see these tables:
   - `businesses` - Customer accounts
   - `users` - User accounts (linked to businesses)
   - `calls` - Call records from Retell
   - `leads` - Qualified leads
   - `notifications` - In-app notifications
   - `notification_preferences` - User settings
   - `call_follow_ups` - Follow-up tasks

### Step 3: Enable Storage Bucket (for recordings)
1. In Supabase, go to **Storage** → **New Bucket**
2. Create bucket named: `call-recordings`
3. Click bucket → **Policies**
4. No policies needed yet (handled by code)

---

## 3. LOGIN & TEST LOCALLY

### Test User Account
```
Email: support@crewdesk.in
Password: H@rSh@311205
```

This user is pre-created in your Supabase.

### Run Locally
```bash
npm install
npm run dev
```

Then visit http://localhost:3000 and login.

---

## 4. ENVIRONMENT VARIABLES FOR PRODUCTION

### Required for Vercel Deployment

Copy these to your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://qbgfkqfyqdcjcdvllirv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RETELL_API_KEY=key_3f3a793e6bacc561da698796cb07
```

### Optional (for security)
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
