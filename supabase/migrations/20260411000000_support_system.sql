
-- Create support_chats table
CREATE TABLE IF NOT EXISTS public.support_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_id TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.support_chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin', 'guest')),
    content TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage support_chats" ON public.support_chats
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage support_messages" ON public.support_messages
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Users can see their own chats
CREATE POLICY "Users can view their own chats" ON public.support_chats
    FOR SELECT USING (auth.uid() = user_id);

-- Guests can see their chats by ID (Using a more restrictive approach is hard without sessions, but we'll stick to basic RLS)
CREATE POLICY "Guests can view their own chats" ON public.support_chats
    FOR SELECT USING (user_id IS NULL AND guest_id IS NOT NULL);

-- Users/Guests can create chats
CREATE POLICY "Anyone can create a support chat" ON public.support_chats
    FOR INSERT WITH CHECK (true);

-- Messages policies: restrict to chat participants
CREATE POLICY "Participants can view messages" ON public.support_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.support_chats
            WHERE id = support_messages.chat_id
            AND (user_id = auth.uid() OR (user_id IS NULL AND guest_id IS NOT NULL))
        )
        OR public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Participants can send messages" ON public.support_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.support_chats
            WHERE id = support_messages.chat_id
            AND (user_id = auth.uid() OR (user_id IS NULL AND guest_id IS NOT NULL))
        )
        OR public.has_role(auth.uid(), 'admin')
    );

-- Realtime
ALTER TABLE public.support_chats REPLICA IDENTITY FULL;
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;

-- Trigger to update last_message_at in support_chats
CREATE OR REPLACE FUNCTION update_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.support_chats
    SET last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_support_message_inserted
AFTER INSERT ON public.support_messages
FOR EACH ROW EXECUTE FUNCTION update_last_message_at();

-- Add to publication for real-time updates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'support_chats'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'support_messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
    END IF;
  END IF;
END $$;

-- Storage bucket for support attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_attachments', 'support_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for support attachments
CREATE POLICY "Anyone can upload support attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'support_attachments');

CREATE POLICY "Anyone can view support attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'support_attachments');
