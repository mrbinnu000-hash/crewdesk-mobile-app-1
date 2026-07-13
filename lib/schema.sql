-- CrewDesk Database Schema

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'receptionist', -- 'receptionist', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Calls table
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caller_phone_number TEXT NOT NULL,
  caller_name TEXT,
  duration_seconds INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed', -- 'completed', 'missed', 'failed'
  call_type TEXT DEFAULT 'inbound', -- 'inbound', 'outbound'
  retell_call_id TEXT UNIQUE,
  transcript TEXT,
  recording_url TEXT,
  call_analysis JSONB, -- AI analysis of the call
  qualified_lead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calls_select_own" ON public.calls FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "calls_insert_own" ON public.calls FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "calls_update_own" ON public.calls FOR UPDATE USING (auth.uid() = agent_id);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  call_id UUID REFERENCES public.calls(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  service_type TEXT, -- type of service requested
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted'
  notes TEXT,
  qualified BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select_own" ON public.leads FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "leads_insert_own" ON public.leads FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "leads_update_own" ON public.leads FOR UPDATE USING (auth.uid() = agent_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  call_id UUID REFERENCES public.calls(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'qualified', 'urgent', 'summary', 'handled', 'daily'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_events_select_own" ON public.analytics_events FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "analytics_events_insert_own" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = agent_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_agent_id ON public.calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON public.calls(created_at);
CREATE INDEX IF NOT EXISTS idx_calls_retell_id ON public.calls(retell_call_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON public.leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(unread);
CREATE INDEX IF NOT EXISTS idx_analytics_events_agent_id ON public.analytics_events(agent_id);
