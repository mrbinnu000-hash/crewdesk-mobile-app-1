# Supabase Setup Guide for CrewDesk

## Quick Start (5 minutes)

Follow these steps to get Supabase configured with the credentials: `support@crewdesk.in` / `H@rSh@311205`

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `crewdesk` (or your choice)
   - **Password**: Generate a strong password
   - **Region**: Choose closest to your location
4. Click **"Create new project"** and wait 2-3 minutes

## Step 2: Get Your Credentials

Once the project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RETELL_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 4: Run Database Migrations

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Copy the entire content from `/lib/migrations/001_init.sql`
4. Paste into the SQL editor
5. Click **"Run"**
6. Wait for completion (should see green checkmark)

Repeat for:
- `/lib/migrations/002_recording_storage.sql`
- `/lib/migrations/003_notification_preferences.sql`

## Step 5: Create Your User Account

Now create the user with the credentials you want to use:

### Option A: Using Supabase Dashboard (Easier)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add user"**
3. Fill in:
   - **Email**: `support@crewdesk.in`
   - **Password**: `H@rSh@311205`
   - **Auto confirm user**: ✅ Check this
4. Click **"Create user"**

### Option B: Using SQL (Advanced)

If Option A doesn't work, use SQL:

1. Go to **SQL Editor** → **New Query**
2. Run this (replace with your Supabase project details):

```sql
-- Create the user in auth
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  created_at,
  updated_at,
  is_sso_user,
  is_super_admin
)
values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'support@crewdesk.in',
  crypt('H@rSh@311205', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  false,
  false
);

-- Create the business
INSERT INTO businesses (id, name, industry)
VALUES (
  gen_random_uuid(),
  'CrewDesk Support',
  'AI Receptionist Services'
);

-- Link user to business
INSERT INTO profiles (id, email, business_id, first_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'support@crewdesk.in'),
  'support@crewdesk.in',
  (SELECT id FROM businesses LIMIT 1),
  'Support'
);
```

## Step 6: Test the Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```
2. Go to `http://localhost:3000/auth/login`
3. Enter:
   - Email: `support@crewdesk.in`
   - Password: `H@rSh@311205`
4. Click "Sign In"
5. You should be redirected to the dashboard

## Troubleshooting

### "Invalid credentials"
- Verify the user was created in Supabase Auth
- Check that email/password match exactly
- Try creating the user again

### "Failed to connect to database"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that migrations ran successfully
- Try clearing browser cache and refresh

### "Cannot find table"
- Re-run all migrations in order
- Check Supabase SQL Editor for errors
- Verify tables exist: `businesses`, `profiles`, `calls`, `leads`, `notifications`

### Environment variables not loading
- Restart dev server after adding `.env.local`
- Make sure file is named exactly `.env.local`
- No spaces around `=` in env file

## Verify Everything Works

Once logged in, you should see:

1. ✅ Dashboard with demo analytics
2. ✅ Leads page (may be empty until calls are processed)
3. ✅ Settings page with business info
4. ✅ Notifications (with demo data)
5. ✅ Logout button that works

## Next Steps

- Configure Retell webhook to send calls to `/api/webhooks/retell`
- Create some test calls in Retell
- Verify they show up on the dashboard
- Configure recording storage (Supabase Storage)

## Support

If you get stuck:
1. Check the console for error messages
2. Verify all environment variables are set
3. Check Supabase logs in the dashboard
4. Review LAUNCH_GUIDE.md for full deployment instructions
