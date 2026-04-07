
-- Promote echinonso609@gmail.com to admin
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'echinonso609@gmail.com';

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
