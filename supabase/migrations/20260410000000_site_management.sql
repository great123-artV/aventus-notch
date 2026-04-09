-- Table for dynamic site content
CREATE TABLE IF NOT EXISTS public.site_configs (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site configs" ON public.site_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage site configs" ON public.site_configs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Ensure visitor_logs has location fields (they were already there but just in case)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visitor_logs' AND column_name = 'latitude') THEN
        ALTER TABLE public.visitor_logs ADD COLUMN latitude NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'visitor_logs' AND column_name = 'longitude') THEN
        ALTER TABLE public.visitor_logs ADD COLUMN longitude NUMERIC;
    END IF;
END $$;

-- Insert some default values for site content
INSERT INTO public.site_configs (id, value, description) VALUES
('hero_title', 'Invest Smarter. Grow Without Limits.', 'Main title on homepage'),
('hero_subtitle', 'One platform for stocks, crypto, forex, real estate, and retirement. Build wealth with institutional-grade tools designed for everyone.', 'Subtitle on homepage'),
('homepage_video_url', 'https://cdn.pixabay.com/video/2024/02/14/200750-913069622_large.mp4', 'URL for the hero background video')
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for site assets if it doesn't exist (handled via Supabase dashboard normally, but we can try SQL for policy)
-- Note: Creating buckets via SQL varies by Supabase version, usually better to check storage schema.
