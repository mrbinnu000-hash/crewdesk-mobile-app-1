-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  qualified_leads_enabled BOOLEAN DEFAULT true,
  urgent_callbacks_enabled BOOLEAN DEFAULT true,
  daily_summaries_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(business_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_preferences
CREATE POLICY "Allow businesses to view their own preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (
    business_id IN (
      SELECT businesses.id FROM public.businesses
      JOIN public.profiles ON businesses.id = profiles.business_id
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Allow businesses to update their own preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (
    business_id IN (
      SELECT businesses.id FROM public.businesses
      JOIN public.profiles ON businesses.id = profiles.business_id
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Allow businesses to insert preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (
    business_id IN (
      SELECT businesses.id FROM public.businesses
      JOIN public.profiles ON businesses.id = profiles.business_id
      WHERE profiles.id = auth.uid()
    )
  );

-- Create trigger to auto-create preferences on business creation
CREATE OR REPLACE FUNCTION public.create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (business_id)
  VALUES (NEW.id)
  ON CONFLICT (business_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_business_created
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.create_notification_preferences();
