-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings" 
  ON public.site_settings FOR SELECT 
  USING (true);

CREATE POLICY "Admins can update site settings" 
  ON public.site_settings FOR ALL 
  USING (
    public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
  );

-- Insert default stats
INSERT INTO public.site_settings (key, value) 
VALUES (
  'stats',
  '{"happyClients": "2,000+", "yearsExperience": "10+"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
