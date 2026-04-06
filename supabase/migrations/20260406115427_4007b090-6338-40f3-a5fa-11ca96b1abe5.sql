
DROP POLICY "Anyone can insert visitor logs" ON public.visitor_logs;
CREATE POLICY "Log visits" ON public.visitor_logs FOR INSERT WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
);
