
-- Create transaction status and type enums
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'rejected');
CREATE TYPE public.transaction_method AS ENUM ('wallet', 'bank_transfer');

CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type transaction_type NOT NULL,
  method transaction_method NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status transaction_status NOT NULL DEFAULT 'pending',
  wallet_address text,
  bank_name text,
  account_number text,
  routing_number text,
  tx_hash text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transactions"
  ON public.transactions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
