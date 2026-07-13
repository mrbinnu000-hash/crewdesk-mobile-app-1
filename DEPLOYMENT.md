# CrewDesk Production Deployment Guide

## Prerequisites

### Required Accounts
- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- Retell AI account (https://retell.ai)
- Domain name (optional, for custom domain)

### Required Software
- Node.js 18.17+ or later
- npm or pnpm
- Git

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Select your organization
4. Enter project name: `crewdesk` (or your preference)
5. Select region closest to your users
6. Create a strong database password
7. Wait for project to initialize (~5 minutes)

### 1.2 Run Database Migration

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire contents of `lib/migrations/001_init.sql`
4. Click "Run"
5. Verify all tables are created

**Tables created:**
- businesses
- profiles
- calls
- leads
- notifications
- notification_preferences
- follow_ups
- analytics_events

### 1.3 Enable RLS

1. Go to "Authentication" → "Policies"
2. Verify RLS is enabled on all tables (should be automatic from migration)
3. Check that policies exist for each table

### 1.4 Get Supabase Credentials

1. Go to "Project Settings" → "API"
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Save these safely

---

## Step 2: Local Development

### 2.1 Clone and Install

```bash
git clone <your-repo-url>
cd crewdesk
npm install  # or pnpm install
```

### 2.2 Environment Variables

Create `.env.development.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Retell (optional for testing)
RETELL_WEBHOOK_SECRET=your-secret-here
```

### 2.3 Run Locally

```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000

### 2.4 Test Authentication

1. Click "Sign Up"
2. Create test account with email and password
3. This automatically creates:
   - User in Supabase Auth
   - Business record
   - Profile record
   - Notification preferences

---

## Step 3: Retell Integration

### 3.1 Configure Retell Webhook

1. Go to Retell AI dashboard
2. Navigate to webhooks/callbacks
3. Add webhook URL: `https://yourdomain.com/api/webhooks/retell`
4. Select Signature Algorithm: `HMAC-SHA256`
5. Copy webhook secret
6. Events to subscribe:
   - call_started
   - call_ended
   - call_analyzed

### 3.2 Store Webhook Secret

Add to environment variables:

```env
RETELL_WEBHOOK_SECRET=your-secret-from-retell
```

This enables signature verification for webhook security.

### 3.3 Test Webhook (Optional)

Make a test POST to your webhook endpoint:

```bash
curl -X POST https://yourdomain.com/api/webhooks/retell \
  -H "Content-Type: application/json" \
  -H "x-retell-signature: test-signature" \
  -d '{
    "call_id": "test-call-123",
    "business_id": "test-business-id",
    "phone_number": "+1234567890",
    "duration_seconds": 120,
    "transcript": "Test transcript",
    "qualified_lead": false
  }'
```

Should return `{ "success": true }`

---

## Step 4: Vercel Deployment

### 4.1 Push to GitHub

```bash
git add .
git commit -m "Production deployment setup"
git push origin main
```

### 4.2 Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select project root
4. Click "Import"

### 4.3 Environment Variables in Vercel

In Vercel project settings → Environment Variables:

Add:
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
RETELL_WEBHOOK_SECRET = your-webhook-secret
```

### 4.4 Deploy

Click "Deploy" and wait for build to complete (~3-5 minutes)

### 4.5 Verify Deployment

1. Click "Visit" to open deployed site
2. Test sign up flow
3. Check dashboard loads
4. Verify database connection works

---

## Step 5: Custom Domain (Optional)

### 5.1 In Vercel

1. Go to project settings → Domains
2. Add your domain
3. Vercel provides DNS records

### 5.2 Update DNS

1. Go to your domain provider (GoDaddy, Namecheap, etc.)
2. Add DNS records as shown by Vercel
3. Wait for DNS propagation (5-30 minutes)

### 5.3 SSL Certificate

Vercel automatically generates SSL certificates. Wait a few minutes for activation.

---

## Step 6: Production Checklist

### Security
- [ ] Environment variables are not in git
- [ ] Database backups are enabled
- [ ] RLS policies are active
- [ ] Webhook signature verification is working

### Functionality
- [ ] Sign up creates business and profile
- [ ] Login works with real credentials
- [ ] Dashboard loads real data
- [ ] Leads page loads real data
- [ ] Logout clears session
- [ ] Retell webhook receives calls

### Monitoring
- [ ] Error tracking configured (optional: Sentry)
- [ ] Database logs enabled
- [ ] Retell webhook logs monitored
- [ ] Daily backups verified

### Documentation
- [ ] Team knows how to access Supabase
- [ ] Webhook secrets stored securely
- [ ] Environment variables documented
- [ ] Deployment process documented

---

## Troubleshooting

### "Database connection failed"

**Cause**: Missing or incorrect Supabase credentials

**Fix**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` exists
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists
3. Restart dev server or redeploy

### "RLS policy violation"

**Cause**: User trying to access another business's data

**Fix**:
1. Check that business_id matches in database
2. Verify RLS policies exist
3. Check that user is authenticated
4. Verify JWT token includes correct user_id

### "Webhook signature invalid"

**Cause**: Webhook secret mismatch

**Fix**:
1. Verify `RETELL_WEBHOOK_SECRET` matches Retell dashboard
2. Check signature algorithm is HMAC-SHA256
3. Verify webhook request includes `x-retell-signature` header

### "Sign up fails to create business"

**Cause**: Trigger not executing

**Fix**:
1. Check that `handle_new_user` trigger exists in Supabase
2. Verify trigger is enabled
3. Check Supabase function logs
4. Manually create business if needed

### "Production build fails"

**Cause**: TypeScript errors or missing dependencies

**Fix**:
1. Run `npm run build` locally
2. Fix any errors shown
3. Verify `NEXT_PUBLIC_` env vars are set
4. Redeploy to Vercel

---

## Monitoring & Maintenance

### Daily Tasks
- Check Retell webhook logs for errors
- Monitor error rate in Vercel
- Review any new error emails

### Weekly Tasks
- Check database size in Supabase
- Review user growth
- Monitor API rate limits
- Verify backups are running

### Monthly Tasks
- Review application analytics
- Check security logs
- Update dependencies
- Performance optimization review

---

## Scaling Considerations

### When to Add Caching
- Database queries >100ms
- Dashboard load >2s
- Real-time data critical

### When to Implement Pagination
- Leads list >100 items
- Calls list >500 items
- Search results >50 items

### When to Add Rate Limiting
- API endpoints hit >100 req/sec
- Webhook failures increase
- Need to prevent abuse

### When to Scale Database
- Monthly queries >100M
- Storage >10GB
- Concurrent connections >50

---

## Backup & Disaster Recovery

### Supabase Backups

1. Go to Project Settings → Backups
2. Enable daily backups (default: 7 days)
3. Manual backup available anytime

### GitHub Backups

- Code is backed up via GitHub
- Pull latest version anytime
- Review deployment history

### Data Recovery

In emergency:
1. Stop all incoming webhooks
2. Contact Supabase support
3. Restore from daily backup
4. Verify data integrity
5. Resume webhooks

---

## Security Best Practices

### Code Level
- [ ] Never commit secrets
- [ ] Use environment variables
- [ ] Enable code scanning on GitHub
- [ ] Review dependencies regularly

### Database Level
- [ ] RLS policies enabled
- [ ] Regular backups configured
- [ ] Strong database passwords
- [ ] IP whitelisting (optional)

### Application Level
- [ ] HTTPS/SSL enabled
- [ ] Webhook signature verification
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Error messages don't leak data

### Infrastructure Level
- [ ] Vercel security scanning enabled
- [ ] Environment variables encrypted
- [ ] Database connection pooling
- [ ] DDoS protection (Vercel built-in)

---

## Getting Help

### Documentation
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- Retell AI: https://docs.retellai.com
- Vercel: https://vercel.com/docs

### Support
- Email: support@crewdesk.com (when deployed)
- GitHub Issues: Report bugs in repository
- Community: Check existing issues/discussions

---

## Next Steps After Deployment

1. **Test Retell Integration**: Make test calls, verify they appear in dashboard
2. **Invite Team Members**: Create accounts for team
3. **Configure Notifications**: Set up notification preferences
4. **Monitor First Week**: Watch for errors, check performance
5. **Plan Feature Rollout**: Recording storage, push notifications, etc.

---

## Version History

- **v1.0.0** (Current)
  - Authentication system
  - Multi-tenancy foundation
  - Dashboard and leads
  - Webhook integration
  - Production-ready database

---

**Last Updated**: 2024
**Deployment Time**: ~15 minutes
**Estimated Cost**: $25-100/month (depending on usage)
