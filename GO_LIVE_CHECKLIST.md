# CrewDesk Go-Live Checklist

**Use this checklist for EVERY new client before they go live.**

Date: ____________  
Client: ____________  
Account Manager: ____________

---

## Phase 1: Pre-Sales (You)

- [ ] Contract signed
- [ ] Payment processed (if applicable)
- [ ] Client contact info collected:
  - [ ] Business name
  - [ ] Primary contact email
  - [ ] Phone number(s) for routing
  - [ ] Industry/business type

---

## Phase 2: Supabase Setup (You - 5 min)

- [ ] Business created in Supabase
- [ ] User profile created
- [ ] Business UUID recorded: ________________
- [ ] User UUID recorded: ________________

**SQL (copy-paste into Supabase SQL Editor):**
```sql
-- 1. Create business
INSERT INTO public.businesses (name)
VALUES ('CLIENT_BUSINESS_NAME')
RETURNING id;
-- Copy the returned UUID above

-- 2. Create profile (paste the UUIDs from step 1 and auth)
INSERT INTO public.profiles (id, business_id, first_name, is_admin)
VALUES ('USER_UUID', 'BUSINESS_UUID', 'First Name', TRUE);

-- 3. Create notification preferences
INSERT INTO public.notification_preferences (profile_id)
VALUES ('USER_UUID');
```

---

## Phase 3: Invite Client (You - 2 min)

- [ ] Send welcome email to client:

```
Subject: Your CrewDesk Account is Ready ✨

Hi [Client Name],

Your CrewDesk account is ready to go!

📱 Sign in here: https://crewdesk.app/auth/login
📧 Email: [CLIENT_EMAIL]
🔐 Temporary password: [TEMP_PASSWORD]

Please change your password on first login.

Questions? Email support@yourcompany.com

Best,
[Your Name]
```

- [ ] Client confirms receipt

---

## Phase 4: Retell Agent Setup (Client - 10 min)

- [ ] Client logs into Retell dashboard
- [ ] Creates new agent:
  - [ ] Name: "[Business Name] - AI Receptionist"
  - [ ] System prompt: Customized for their industry
  - [ ] Voice: Selected
- [ ] Configures phone numbers
- [ ] Tests agent with sample call
- [ ] Provides you with Agent ID: ________________

---

## Phase 5: Store Agent ID (You - 1 min)

- [ ] Run this SQL in Supabase:

```sql
UPDATE public.businesses
SET retell_agent_id = 'AGENT_ID_FROM_CLIENT'
WHERE id = 'BUSINESS_UUID';
```

---

## Phase 6: Configure Webhook (You - 3 min)

- [ ] In Retell dashboard, add webhook:
  - [ ] URL: `https://crewdesk.app/api/webhooks/retell`
  - [ ] Webhook Secret: `RETELL_WEBHOOK_SECRET`
  - [ ] Events: `call_ended`, `call_created`
- [ ] Test webhook delivery

---

## Phase 7: Client First Login (Client - 2 min)

- [ ] Client logs into CrewDesk
- [ ] Sees dashboard (may show 0 calls initially - normal)
- [ ] Updates profile:
  - [ ] First/Last name
  - [ ] Company info
- [ ] Explores `/settings` page

---

## Phase 8: Notification Preferences (Client - 2 min)

- [ ] Client goes to `/settings`
- [ ] Configures preferences:
  - [ ] ☑️ Qualified leads notifications
  - [ ] ☑️ Urgent callback alerts
  - [ ] ☑️ Daily summaries
  - [ ] ☐ Email notifications (if desired)
- [ ] Clicks "Save"

---

## Phase 9: Test Call (Client or You - 5 min)

- [ ] Client calls their Retell-configured number
- [ ] AI receptionist answers
- [ ] Call completes
- [ ] **Verify in CrewDesk:**
  - [ ] `/dashboard` shows +1 call count
  - [ ] `/calls` shows the new call
  - [ ] Call details show:
    - [ ] Phone number
    - [ ] Duration
    - [ ] Transcript (if captured)

**If call doesn't appear within 2 min:**
- [ ] Check Retell webhook logs
- [ ] Verify webhook URL is correct
- [ ] Verify `RETELL_WEBHOOK_SECRET` is set
- [ ] Check Supabase for database errors
- [ ] Re-test webhook delivery

---

## Phase 10: Test Qualified Lead (You or Client - 5 min)

**Objective:** Verify that AI-marked qualified leads create lead records

- [ ] Make test call with qualification keywords (industry-specific)
- [ ] AI should mark as qualified
- [ ] **Verify in CrewDesk:**
  - [ ] `/leads` shows new lead
  - [ ] Lead status: "new"
  - [ ] Customer details populated
  - [ ] Notification created in `/notifications`

**If lead doesn't appear:**
- [ ] Check Retell API - is `qualified_lead` field being sent?
- [ ] Check Supabase for lead record
- [ ] Check database error logs

---

## Phase 11: Test Recording (Optional - 3 min)

- [ ] Click on a call in `/dashboard`
- [ ] If recording available:
  - [ ] Click "Download Recording"
  - [ ] File downloads successfully
  - [ ] Audio plays correctly

**If recording unavailable:**
- [ ] Verify Retell is capturing recordings
- [ ] Check Supabase storage bucket exists
- [ ] Verify signed URL generation works

---

## Phase 12: Data Isolation Verification (You - 2 min)

**Verify this client CANNOT access another client's data**

- [ ] Log in as Client A (this client)
- [ ] Check `/dashboard` - shows only Client A's data
- [ ] Check `/leads` - shows only Client A's leads
- [ ] Verify `/calls` - shows only Client A's calls

**Try to access other client's data:**
- [ ] Client A cannot see Client B's calls in dashboard
- [ ] If URL hacked to show Client B's data, RLS blocks it
- [ ] API requests return empty for other businesses

✅ **Multi-tenancy verified**

---

## Phase 13: Final Testing (You - 5 min)

- [ ] Test sign out / sign in flow
- [ ] Test password reset
- [ ] Verify all pages load without errors
- [ ] Check mobile responsiveness (if applicable)
- [ ] Verify email notifications (if enabled)

---

## Phase 14: Client Training (You - 15 min)

**Share with client:**
- [ ] Dashboard overview (metrics, recent activity)
- [ ] How to use lead management
- [ ] How to adjust notification preferences
- [ ] How to access recordings/transcripts
- [ ] How to contact support

---

## Phase 15: Go-Live (Client - whenever ready)

- [ ] Client updates Retell agent with production system prompt
- [ ] Client enables call routing to customers
- [ ] **Monitor first hour:**
  - [ ] Calls are coming through ✓
  - [ ] Leads are being created ✓
  - [ ] Notifications are working ✓
  - [ ] Dashboard is updating ✓

---

## Phase 16: Follow-Up (You - within 24 hours)

- [ ] Email client: "How is CrewDesk working for you?"
- [ ] Address any initial issues
- [ ] Schedule 30-day check-in

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| **Client can't log in** | Check email verification status in Supabase auth |
| **Dashboard shows 0 calls** | Verify Retell webhook is being sent, check Supabase logs |
| **Lead not appearing** | Verify `qualified_lead: true` in Retell payload, check RLS policies |
| **Recording won't download** | Verify Supabase storage bucket exists, check signed URL expiry |
| **See another client's data** | Bug - contact dev team immediately, check RLS policies |
| **Slow dashboard** | Check database query times, verify indexes exist |
| **Webhook signature fails** | Verify `RETELL_WEBHOOK_SECRET` matches in Retell settings |

---

## Sign-Off

- [ ] Client confirmed everything working
- [ ] All tests passed
- [ ] Support contact info provided
- [ ] 30-day follow-up scheduled

**Ready for production:** ☑️ YES ☐ NO

**If NO, list blocking issues:**
1. ____________
2. ____________
3. ____________

---

**Prepared by:** ________________ (Your name)  
**Date:** ________________  
**Client Signature:** ________________
