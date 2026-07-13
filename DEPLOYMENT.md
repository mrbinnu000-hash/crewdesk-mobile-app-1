# CrewDesk Deployment Guide

Complete guide to deploy CrewDesk to production and start onboarding clients.

## Phase 1: Prepare Your Environment

### 1.1 Verify All Credentials

Make sure you have:
- ✅ Supabase project with schema set up
- ✅ Retell API key
- ✅ Your domain (or use Vercel's free domain)

### 1.2 Test Locally

```bash
# Install dependencies
pnpm install

# Run database schema
# (See DATABASE_SETUP.md)

# Start local server
pnpm dev

# Navigate to http://localhost:3000
```

## Phase 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add complete backend with Supabase and Retell integration"
git push origin main
```

2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Choose "CrewDesk" as the project name
5. Click "Deploy"

### 2.2 Configure Environment Variables in Vercel

After deployment, go to your Vercel project settings:

1. **Settings** → **Environment Variables**
2. Add these variables:

```
SUPABASE_PROJECT_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
RETELL_API_KEY=xxxxx
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com/auth/callback
```

3. Click "Save"

### 2.3 Redeploy

After adding environment variables:
1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select "Redeploy"

## Phase 3: Configure Retell Webhooks

### 3.1 Update Webhook URL

1. Go to Retell Dashboard → Settings → Webhooks
2. Update webhook URL to your production domain:
   ```
   https://yourdomain.com/api/webhooks/retell
   ```
3. Select events to listen for:
   - ✅ call_started
   - ✅ call_ended
   - ✅ call_analyzed

### 3.2 Test Webhook

Make a test call through Retell and verify:
1. Call appears in database
2. Notifications are created
3. Leads are generated if qualified

## Phase 4: Set Up Custom Domain (Optional)

### 4.1 Add Domain to Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Enter your domain
3. Follow DNS configuration steps
4. Wait for SSL certificate (usually ~5 minutes)

### 4.2 Update Retell Webhook URL

Update the webhook URL in Retell to use your custom domain:
```
https://yourdomain.com/api/webhooks/retell
```

## Phase 5: Client Onboarding

### 5.1 Create Client Account

For each client:

1. Send them the sign-up link:
   ```
   https://yourdomain.com/auth/sign-up
   ```

2. They create account with:
   - Email
   - Password

3. Email confirmation required

### 5.2 Connect Retell to Their Number

1. Client gets their AI receptionist number from Retell
2. They configure call forwarding from their business number
3. Calls now route to AI receptionist
4. Calls logged automatically in CrewDesk

### 5.3 Train on Dashboard

Show them:
- **Dashboard**: Overview of calls and leads
- **Leads**: All qualified leads with customer info
- **Notifications**: Real-time alerts for qualified leads
- **Analytics**: Performance metrics and trends

## Phase 6: Monitor & Optimize

### 6.1 Monitor Performance

Watch for:
- Call success rate (should be >95%)
- Lead qualification accuracy
- System uptime (Vercel provides 99.95% SLA)

### 6.2 Analytics Checks

Check the Analytics page for:
- Total calls handled
- Conversion rate
- Average call duration
- Lead status distribution

### 6.3 Troubleshoot Issues

Common issues:

**Calls not showing:**
- Verify Retell webhook URL is correct
- Check API key is valid
- Review Retell webhook logs

**Leads not created:**
- Verify call analysis is enabled in Retell
- Check database for call records
- Review error logs in Vercel

**Notifications not appearing:**
- Verify database connection
- Check Supabase RLS policies
- Review browser console for errors

## Phase 7: Scale & Maintain

### 7.1 Database Backups

In Supabase:
1. Go to **Settings** → **Backups**
2. Enable daily automated backups
3. Set retention to 30 days

### 7.2 Monitor Database Usage

1. Go to **Database** → **Health**
2. Monitor:
   - Connection count
   - Query performance
   - Storage usage

### 7.3 Set Up Alerts

In Vercel:
1. Go to **Integrations** → **Slack** (optional)
2. Enable alerts for:
   - Build failures
   - High error rates
   - Performance issues

## Phase 8: Advanced Features (Optional)

### 8.1 Add Email Notifications

Update `/app/api/notifications/route.ts` to send emails:

```typescript
// Add to webhook handler
await sendEmail({
  to: user.email,
  subject: 'New Qualified Lead',
  template: 'qualified_lead'
})
```

### 8.2 Add SMS Alerts

Integrate Twilio or AWS SNS:

```typescript
// Example with Twilio
await client.messages.create({
  body: 'New qualified lead from ' + lead.customer_name,
  from: '+1234567890',
  to: user.phone_number
})
```

### 8.3 Add Call Recording Storage

Store recordings in Vercel Blob:

```typescript
// In webhook handler
const blob = await put(
  `recordings/${call.id}.mp3`,
  recording_url,
  { access: 'private' }
)
```

## Production Checklist

- [ ] Database schema created
- [ ] Environment variables set in Vercel
- [ ] Retell webhook URL configured
- [ ] SSL certificate installed
- [ ] Custom domain set up (if applicable)
- [ ] Test call completed end-to-end
- [ ] Client account created and tested
- [ ] Analytics page verified
- [ ] Notification system tested
- [ ] Backups enabled
- [ ] Monitoring alerts set up
- [ ] Client documentation prepared

## Support

For issues or questions:

1. **Supabase Help**: https://supabase.com/docs
2. **Retell Documentation**: https://docs.retellai.com
3. **Vercel Support**: https://vercel.com/help
4. **Next.js Documentation**: https://nextjs.org/docs

## Next: Client Success

Once deployed:

1. Train clients on the dashboard
2. Monitor for issues
3. Gather feedback
4. Iterate on features
5. Scale to more clients

Your CrewDesk AI Receptionist platform is now ready to serve clients!
