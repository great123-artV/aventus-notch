-- Investment Plans Table
CREATE TABLE IF NOT EXISTS public.investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invest_amount NUMERIC NOT NULL,
    earn_amount NUMERIC NOT NULL,
    is_hot BOOLEAN DEFAULT false,
    duration_hours INTEGER DEFAULT 48,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investment_plans' AND policyname = 'Anyone can read investment plans') THEN
        CREATE POLICY "Anyone can read investment plans" ON public.investment_plans FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investment_plans' AND policyname = 'Admins can manage investment plans') THEN
        CREATE POLICY "Admins can manage investment plans" ON public.investment_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- Insert default plans if table is empty
INSERT INTO public.investment_plans (invest_amount, earn_amount, is_hot)
SELECT v.* FROM (VALUES
    (100, 2050, false),
    (200, 3500, false),
    (300, 5500, true),
    (500, 7500, true),
    (1000, 12500, false)
) AS v(invest_amount, earn_amount, is_hot)
WHERE NOT EXISTS (SELECT 1 FROM public.investment_plans);

-- Support System Tables
CREATE TABLE IF NOT EXISTS public.support_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.support_chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    is_admin_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- support_chats policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_chats' AND policyname = 'Users can view their own chat') THEN
        CREATE POLICY "Users can view their own chat" ON public.support_chats FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_chats' AND policyname = 'Admins can view all chats') THEN
        CREATE POLICY "Admins can view all chats" ON public.support_chats FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_chats' AND policyname = 'Users can create their own chat') THEN
        CREATE POLICY "Users can create their own chat" ON public.support_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_chats' AND policyname = 'Admins can update chats') THEN
        CREATE POLICY "Admins can update chats" ON public.support_chats FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
    END IF;

    -- support_messages policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_messages' AND policyname = 'Users can view messages in their chat') THEN
        CREATE POLICY "Users can view messages in their chat" ON public.support_messages FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.support_chats WHERE id = chat_id AND user_id = auth.uid())
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_messages' AND policyname = 'Admins can view all messages') THEN
        CREATE POLICY "Admins can view all messages" ON public.support_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_messages' AND policyname = 'Users can send messages to their chat') THEN
        CREATE POLICY "Users can send messages to their chat" ON public.support_messages FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.support_chats WHERE id = chat_id AND user_id = auth.uid())
            AND sender_id = auth.uid()
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_messages' AND policyname = 'Admins can send messages to any chat') THEN
        CREATE POLICY "Admins can send messages to any chat" ON public.support_messages FOR INSERT WITH CHECK (
            public.has_role(auth.uid(), 'admin')
        );
    END IF;
END $$;

-- Enable Realtime
-- Use DO block to check if publication exists or handle error
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'support_messages' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'support_chats' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;
