
-- Create site_configs table for CMS
CREATE TABLE public.site_configs (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site configs"
  ON public.site_configs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site configs"
  ON public.site_configs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default configs
INSERT INTO public.site_configs (id, value) VALUES
  ('hero_title', 'Invest Smarter. Grow Without Limits.'),
  ('hero_subtitle', 'One platform for stocks, crypto, forex, real estate, and retirement. Build wealth with institutional-grade tools designed for everyone.'),
  ('homepage_video_url', 'https://cdn.pixabay.com/video/2024/02/14/200750-913069622_large.mp4'),
  ('stat_1_val', '$12.4B+'),
  ('stat_1_label', 'Assets Under Management'),
  ('stat_2_val', '500K+'),
  ('stat_2_label', 'Active Investors'),
  ('trust_tagline', 'SEC Regulated • 256-bit Encryption'),
  ('cta_title', 'Ready to Build Your Wealth?'),
  ('cta_desc', 'Join 500,000+ investors already growing their portfolios.'),
  ('footer_desc', 'The all-in-one investment ecosystem for modern investors.'),
  ('copyright_text', '© 2026 Aventus-Notch. All rights reserved.');

-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) VALUES ('public', 'public', true);

CREATE POLICY "Anyone can view public files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public');

CREATE POLICY "Admins can upload public files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update public files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete public files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public' AND public.has_role(auth.uid(), 'admin'));
