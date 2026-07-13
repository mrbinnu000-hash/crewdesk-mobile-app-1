# CrewDesk - Deployment Checklist

## Pre-Deployment (Verify Everything Works)

### Code & Dependencies
- [ ] All dependencies installed: `pnpm install`
- [ ] Dev server runs: `pnpm dev`
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] No ESLint errors: `pnpm lint`
- [ ] All pages load without errors
- [ ] Analytics page shows data
- [ ] Notifications display correctly
- [ ] Bottom nav shows all 5 tabs

### Environment Setup
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Retell account created
- [ ] Retell API key obtained
- [ ] All 4 env vars ready:
  - `SUPABASE_PROJECT_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RETELL_API_KEY`

### Database Schema
- [ ] Supabase project selected
- [ ] SQL Editor open
- [ ] `/lib/schema.sql` copied
- [ ] Schema pasted in SQL Editor
- [ ] Run button clicked
- [ ] 5 tables created (verify in Table Editor):
  - [ ] profiles
  - [ ] calls
  - [ ] leads
  - [ ] notifications
  - [ ] analytics_events
- [ ] All RLS policies created
- [ ] All indexes created
- [ ] Trigger created for auto-profile

### Manual Testing
- [ ] Sign-up page works
- [ ] Email confirmation works
- [ ] Dashboard loads after login
- [ ] Can navigate to all 5 pages
- [ ] Analytics page loads (shows loading initially)
- [ ] Notifications page shows demo data
- [ ] Leads page shows demo data
- [ ] Bottom nav is responsive
- [ ] Mobile view looks good

---

## Deployment to Vercel

### Vercel Setup
- [ ] GitHub account connected
- [ ] Code pushed to main branch:
  ```bash
  git add .
  git commit -m "Add complete backend with Supabase and Retell integration"
  git push origin main
  ```
- [ ] GitHub repo accessible
- [ ] Vercel account created
- [ ] Project created in Vercel

### Vercel Configuration
- [ ] Project name set to "crewdesk"
- [ ] Framework: Next.js
- [ ] Build command: `pnpm build`
- [ ] Output directory: `.next`
- [ ] Install command: `pnpm install`

### Environment Variables in Vercel
- [ ] Go to Project Settings → Environment Variables
- [ ] Add `SUPABASE_PROJECT_URL`
- [ ] Add `SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `RETELL_API_KEY`
- [ ] All variables set for:
  - [ ] Preview (branch deployments)
  - [ ] Production (main branch)

### Deploy
- [ ] Initial deployment triggered
- [ ] Build completes successfully
- [ ] No build errors
- [ ] Deployment successful
- [ ] Live on vercel.app domain
- [ ] Note production URL

### Post-Deployment Verification
- [ ] Production URL loads
- [ ] All pages accessible
- [ ] Sign-up works
- [ ] Dashboard displays
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Lighthouse score checked

---

## Retell Webhook Configuration

### Retell Dashboard Setup
- [ ] Retell account logged in
- [ ] Project selected
- [ ] Settings → Webhooks accessed
- [ ] Webhook URL updated to production URL:
  ```
  https://yourdomain.com/api/webhooks/retell
  ```
  (replace `yourdomain.com` with your actual Vercel domain)
- [ ] Events selected:
  - [ ] call_started
  - [ ] call_ended
  - [ ] call_analyzed
- [ ] Webhook saved

### Webhook Testing
- [ ] Make a test call through Retell
- [ ] Verify call appears in Supabase calls table
- [ ] Check call has duration and status
- [ ] Verify notification created (if qualified)
- [ ] Check analytics shows call

---

## Custom Domain (Optional but Recommended)

### Domain Setup
- [ ] Domain registered (or already owned)
- [ ] Domain registrar accessible
- [ ] Vercel project settings open

### Add Domain to Vercel
- [ ] Go to Vercel → Project → Settings → Domains
- [ ] Enter custom domain
- [ ] Click "Add"
- [ ] Copy DNS records from Vercel
- [ ] Go to domain registrar
- [ ] Add DNS records:
  - [ ] Add CNAME record for subdomain
  - [ ] Or add A/AAAA records for root domain
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify domain connected in Vercel
- [ ] SSL certificate auto-installed

### Update URLs
- [ ] Update Retell webhook URL to custom domain
- [ ] Update any links in docs
- [ ] Share production domain with clients

---

## Client Setup - First Client

### Create Admin Account
- [ ] Go to `https://yourdomain.com/auth/sign-up`
- [ ] Create account with your email
- [ ] Confirm email
- [ ] Sign in successful
- [ ] Can see dashboard

### Create Test Client Account
- [ ] Create another account for testing
- [ ] Verify email
- [ ] Sign in as test user
- [ ] See empty dashboard (expected)

### Test Full Flow
- [ ] Create test lead via API:
  ```bash
  curl -X POST https://yourdomain.com/api/leads \
    -H "Content-Type: application/json" \
    -d '{
      "customer_name": "Test Customer",
      "customer_phone": "+1234567890",
      "service_type": "test",
      "qualified": true
    }'
  ```
- [ ] Lead appears on dashboard
- [ ] Notification created
- [ ] Analytics updated

### Monitor Logs
- [ ] Check Vercel Deployments → Logs
- [ ] Check for any errors
- [ ] Monitor API performance
- [ ] No 500 errors
- [ ] Response times reasonable

---

## Security Verification

### HTTPS
- [ ] Vercel HTTPS enabled (auto)
- [ ] All pages serve over HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

### Authentication
- [ ] Sign-up requires email confirmation
- [ ] Password hashing (via Supabase)
- [ ] Session cookies secure
- [ ] Can't access without login
- [ ] Logout works

### Data Access
- [ ] Can only see own data
- [ ] Can't access other user's calls
- [ ] Can't access other user's leads
- [ ] RLS policies working

### API Security
- [ ] Endpoints require authentication
- [ ] 401 error for unauthorized requests
- [ ] Input validation working
- [ ] No SQL injection possible
- [ ] No data leakage

---

## Performance Check

### Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Leads page loads < 2 seconds
- [ ] Notifications load < 2 seconds
- [ ] Analytics loads < 2 seconds
- [ ] API responses < 200ms

### Lighthouse Audit
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 80

### Mobile Responsiveness
- [ ] Dashboard looks good on mobile
- [ ] Leads list displays correctly
- [ ] Notifications readable
- [ ] Bottom nav accessible
- [ ] No horizontal scroll

---

## Database Backup

### Supabase Backup
- [ ] Supabase Settings → Backups accessed
- [ ] Automated backups enabled
- [ ] Daily backup frequency
- [ ] 30-day retention set
- [ ] Manual backup created

---

## Monitoring & Alerts (Optional)

### Vercel Monitoring
- [ ] Analytics dashboard open
- [ ] Monitor builds
- [ ] Monitor deployments
- [ ] Check error rates

### Supabase Monitoring
- [ ] Database health checked
- [ ] Connection count monitored
- [ ] Query performance checked
- [ ] Storage usage monitored

### Set Up Alerts (Optional)
- [ ] Slack integration added (optional)
- [ ] Email alerts enabled
- [ ] Error threshold set
- [ ] Performance threshold set

---

## Documentation & Handover

### Client Documentation
- [ ] Sign-up instructions ready
- [ ] Dashboard walkthrough prepared
- [ ] Feature descriptions written
- [ ] FAQ document created
- [ ] Support email setup
- [ ] Contact information provided

### Internal Documentation
- [ ] All docs reviewed for accuracy
- [ ] API documentation verified
- [ ] Deployment steps documented
- [ ] Troubleshooting guide ready
- [ ] Maintenance procedures documented

---

## Go Live Checklist

### Final Verification (1 hour before launch)
- [ ] All systems green in Vercel
- [ ] Database healthy in Supabase
- [ ] Retell webhooks configured
- [ ] No recent deploys pending
- [ ] Team notified of launch
- [ ] Support team ready

### Launch Communication
- [ ] Launch announcement prepared
- [ ] Client welcome email drafted
- [ ] Social media posts ready (if applicable)
- [ ] Internal team notified
- [ ] Slack channel created for support

### First 24 Hours
- [ ] Monitor error logs closely
- [ ] Check analytics dashboard
- [ ] Respond to any issues immediately
- [ ] Track client signups
- [ ] Monitor API performance
- [ ] Document any issues

### First Week
- [ ] Daily monitoring of all systems
- [ ] Gather client feedback
- [ ] Monitor database growth
- [ ] Check analytics accuracy
- [ ] Make small optimizations
- [ ] Plan feature updates

---

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Uptime | 99.5%+ | [ ] |
| Page Load | < 2s | [ ] |
| API Response | < 200ms | [ ] |
| Error Rate | < 1% | [ ] |
| Clients Onboarded | 1+ | [ ] |
| Calls Logged | 1+ | [ ] |
| Leads Created | 1+ | [ ] |
| Bugs Found | 0 | [ ] |

---

## Post-Deployment Tasks

### Day 1
- [ ] Monitor all systems
- [ ] Fix any critical issues
- [ ] Document any learnings
- [ ] Prepare for first client

### Week 1
- [ ] Onboard first customer
- [ ] Complete test flow
- [ ] Gather feedback
- [ ] Monitor metrics

### Month 1
- [ ] Scale to 5+ clients
- [ ] Monitor database growth
- [ ] Optimize based on usage
- [ ] Plan next features

---

## Rollback Plan (If Needed)

### Vercel Rollback
- [ ] Go to Deployments
- [ ] Find previous stable deployment
- [ ] Click three dots
- [ ] Select "Promote to Production"
- [ ] Confirm rollback
- [ ] Verify system stable

### Database Rollback (If Needed)
- [ ] Go to Supabase Backups
- [ ] Select backup from before issue
- [ ] Restore backup
- [ ] Verify data integrity
- [ ] Update team

---

## Support Escalation

### Issues During Deployment
1. Check error logs in Vercel
2. Check database health in Supabase
3. Check Retell webhook logs
4. Review API response times
5. Check for rate limits

### Who to Contact
- **Vercel Issues**: support@vercel.com
- **Supabase Issues**: support@supabase.com
- **Retell Issues**: support@retellai.com

---

## Final Status

- [ ] **All systems checked**
- [ ] **All tests passed**
- [ ] **Database ready**
- [ ] **APIs working**
- [ ] **Webhooks configured**
- [ ] **Security verified**
- [ ] **Performance acceptable**
- [ ] **Documentation complete**

---

## 🚀 READY TO LAUNCH

Once all items are checked:

**Your CrewDesk platform is production-ready and can start serving clients!**

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**: _______________________________________________
