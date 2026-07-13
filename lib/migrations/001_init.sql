-- Enable UUID and other extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- BUSINESSES TABLE (Multi-tenancy foundation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CALLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  call_id TEXT NOT NULL, -- Retell call ID
  phone_number TEXT,
  duration_seconds INTEGER DEFAULT 0,
  transcript TEXT,
  recording_url TEXT,
  call_analysis JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'completed', -- completed, missed, voicemail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================
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
  status TEXT DEFAULT 'new', -- new, contacted, qualified, won, lost
  score INTEGER DEFAULT 0,
  urgency TEXT DEFAULT 'low', -- low, medium, high
  follow_up_scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- qualified, urgent, handled, summary, daily
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================
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

-- ============================================================================
-- FOLLOW_UPS TABLE
-- ============================================================================
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

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- call_received, lead_created, etc
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Businesses: Users can only view their own business
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own business"
  ON public.businesses FOR SELECT
  USING (id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- Profiles: Users can view profiles in their business
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view profiles in their business"
  ON public.profiles FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert profiles in their business"
  ON public.profiles FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Calls: Users can only view calls from their business
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view calls in their business"
  ON public.calls FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert calls in their business"
  ON public.calls FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update calls in their business"
  ON public.calls FOR UPDATE
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- Leads: Users can only view leads from their business
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view leads in their business"
  ON public.leads FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert leads in their business"
  ON public.leads FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update leads in their business"
  ON public.leads FOR UPDATE
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- Notifications: Users can view notifications for their business
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view notifications in their business"
  ON public.notifications FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update notification read status"
  ON public.notifications FOR UPDATE
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert notifications in their business"
  ON public.notifications FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- Notification Preferences: Users can manage their own preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Follow-ups: Users can manage follow-ups in their business
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view follow-ups in their business"
  ON public.follow_ups FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert follow-ups in their business"
  ON public.follow_ups FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update follow-ups in their business"
  ON public.follow_ups FOR UPDATE
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- Analytics events: Users can view analytics for their business
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analytics in their business"
  ON public.analytics_events FOR SELECT
  USING (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert analytics in their business"
  ON public.analytics_events FOR INSERT
  WITH CHECK (business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()));

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

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

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_follow_ups_updated_at
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- TRIGGER TO CREATE PROFILE ON NEW USER SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  business_id UUID;
BEGIN
  -- Create a new business for this user
  INSERT INTO public.businesses (name)
  VALUES (COALESCE(new.raw_user_meta_data->>'business_name', 'My Business'))
  RETURNING id INTO business_id;

  -- Create a profile for this user
  INSERT INTO public.profiles (id, business_id, first_name, is_admin)
  VALUES (
    new.id,
    business_id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
    TRUE
  );

  -- Create default notification preferences
  INSERT INTO public.notification_preferences (profile_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
