# CrewDesk - Quick Start Guide

## 5-Minute Setup

### 1. Setup Database (2 minutes)

Go to [Supabase Dashboard](https://app.supabase.com):
1. Select your project
2. SQL Editor → New Query
3. Copy from `/lib/schema.sql`
4. Click Run

**Status**: ✅ Database ready

### 2. Verify Credentials (1 minute)

Check your Vercel project settings have:
- `SUPABASE_PROJECT_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RETELL_API_KEY`

**Status**: ✅ Credentials set

### 3. Deploy (2 minutes)

```bash
# If you haven't already
git push origin main

# Vercel auto-deploys
```

**Status**: ✅ Live at yourdomain.com

---

## Core Features at a Glance

| Feature | Endpoint | Status |
|---------|----------|--------|
| Call Logging | `/api/calls` | ✅ Ready |
| Lead Generation | `/api/leads` | ✅ Ready |
| Notifications | `/api/notifications` | ✅ Ready |
| Analytics | `/api/analytics/dashboard` | ✅ Ready |
| Retell Webhooks | `/api/webhooks/retell` | ✅ Ready |

---

## Dashboard Pages

| Page | URL | What It Does |
|------|-----|--------------|
| Dashboard | `/dashboard` | Overview of calls and urgent alerts |
| Leads | `/leads` | View and manage generated leads |
| Notifications | `/notifications` | Real-time alerts for qualified leads |
| Analytics | `/analytics` | Performance metrics and trends |
| Settings | `/settings` | User preferences |

---

## For Each Client

### Sign Up
```
https://yourdomain.com/auth/sign-up
```
They create account with email + password.

### How It Works
1. Business number calls Retell AI number
2. Call is answered by AI receptionist
3. AI qualifies the lead
4. Lead auto-saved to CrewDesk
5. Agent gets real-time notification

### What They See
- All incoming calls with details
- Qualified leads with customer info
- Performance analytics
- Call transcripts and recordings

---

## Admin Checklist

- [ ] Database schema created
- [ ] Environment variables in Vercel
- [ ] App deployed to production
- [ ] Retell webhook URL set
- [ ] Test call completed
- [ ] First client account created
- [ ] Email confirmation working
- [ ] Analytics showing data
- [ ] Ready to onboard clients

---

## Key Integrations

**Supabase**: Database + Auth
- Connection: Environment variables
- Tables: profiles, calls, leads, notifications, analytics_events
- Security: Row Level Security (RLS)

**Retell AI**: Phone receptionist
- Webhook: `/api/webhooks/retell`
- Events: call_started, call_ended, call_analyzed
- Data: Transcripts, recordings, analysis

**Vercel**: Hosting + Deployment
- Auto-deploy on git push
- Environment variables management
- SSL/HTTPS included

---

## Troubleshooting

### "Unauthorized" Error
→ Verify user is logged in
→ Check Supabase RLS policies

### "Webhook Failed"
→ Verify webhook URL in Retell
→ Check API key is valid

### "No analytics showing"
→ Create test call via API
→ Wait 30 seconds for data to sync
→ Refresh page

### Database Connection Issues
→ Verify `SUPABASE_PROJECT_URL` is correct
→ Check `SUPABASE_ANON_KEY` is valid
→ Ensure network access is enabled

---

## API Quick Reference

### Get All Calls
```bash
curl https://yourdomain.com/api/calls \
  -H "Cookie: supabase-auth=<token>"
```

### Create a Lead
```bash
curl -X POST https://yourdomain.com/api/leads \
  -H "Content-Type: application/json" \
  -H "Cookie: supabase-auth=<token>" \
  -d '{
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "service_type": "roof replacement",
    "qualified": true
  }'
```

### Get Analytics
```bash
curl https://yourdomain.com/api/analytics/dashboard?days=7 \
  -H "Cookie: supabase-auth=<token>"
```

---

## Database Tables at a Glance

**profiles**
- User accounts and roles
- id (user ID), email, full_name, role

**calls**
- All phone calls
- id, agent_id, caller_phone, duration, transcript, recording_url

**leads**
- Qualified leads from calls
- id, customer_name, customer_phone, service_type, status, qualified

**notifications**
- Real-time alerts
- id, user_id, type, title, message, unread

**analytics_events**
- Usage tracking
- id, agent_id, event_type, event_data

---

## Next: Scale Up

Once everything is working:

1. Onboard 5-10 pilot clients
2. Monitor analytics and feedback
3. Optimize based on usage patterns
4. Add more advanced features
5. Scale to 100+ clients

---

## Need Help?

- **Database**: Supabase docs → supabase.com/docs
- **Phone**: Retell docs → docs.retellai.com
- **Hosting**: Vercel docs → vercel.com/docs
- **Code**: Next.js docs → nextjs.org/docs

---

**Your CrewDesk platform is ready to launch!** 🚀
