-- 1. Function to process a transaction (deposit/withdrawal)
CREATE OR REPLACE FUNCTION process_transaction(
    p_type public.transaction_type,
    p_amount NUMERIC,
    p_asset TEXT,
    p_wallet_address TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_current_balance NUMERIC;
    v_transaction_id UUID;
BEGIN
    -- Check if user is authenticated
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get current balance
    SELECT balance INTO v_current_balance FROM profiles WHERE user_id = v_user_id FOR UPDATE;

    -- Validation for withdrawal
    IF p_type = 'withdrawal' AND (v_current_balance IS NULL OR v_current_balance < p_amount) THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- Update balance immediately (as requested in the task for "immediate" feedback)
    IF p_type = 'deposit' THEN
        UPDATE profiles SET balance = COALESCE(balance, 0) + p_amount WHERE user_id = v_user_id;
    ELSIF p_type = 'withdrawal' THEN
        UPDATE profiles SET balance = COALESCE(balance, 0) - p_amount WHERE user_id = v_user_id;
    ELSE
        -- For 'investment' or 'profit', we might handle them differently,
        -- but for now let's allow them if they are valid enum values.
        IF p_type = 'investment' THEN
            UPDATE profiles SET balance = COALESCE(balance, 0) - p_amount WHERE user_id = v_user_id;
        ELSIF p_type = 'profit' THEN
            UPDATE profiles SET balance = COALESCE(balance, 0) + p_amount WHERE user_id = v_user_id;
        END IF;
    END IF;

    -- Record the transaction
    INSERT INTO transactions (user_id, type, amount, asset, status, wallet_address)
    VALUES (v_user_id, p_type, p_amount, p_asset, 'pending', p_wallet_address)
    RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', v_transaction_id,
        'new_balance', (SELECT balance FROM profiles WHERE user_id = v_user_id)
    );
END;
$$;

-- 2. Function for admin to review (approve/reject) a transaction
CREATE OR REPLACE FUNCTION review_transaction(
    p_transaction_id UUID,
    p_new_status public.transaction_status -- 'completed' or 'rejected'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_transaction RECORD;
BEGIN
    -- Check if current user is an admin
    IF NOT public.has_role(v_admin_id, 'admin') THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Get the transaction details
    SELECT * INTO v_transaction FROM transactions WHERE id = p_transaction_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found';
    END IF;

    IF v_transaction.status != 'pending' THEN
        RAISE EXCEPTION 'Transaction is already %', v_transaction.status;
    END IF;

    -- If rejected, we must REVERT the balance change that was made in process_transaction
    IF p_new_status = 'rejected' THEN
        IF v_transaction.type = 'deposit' OR v_transaction.type = 'profit' THEN
            UPDATE profiles SET balance = balance - v_transaction.amount WHERE user_id = v_transaction.user_id;
        ELSIF v_transaction.type = 'withdrawal' OR v_transaction.type = 'investment' THEN
            UPDATE profiles SET balance = balance + v_transaction.amount WHERE user_id = v_transaction.user_id;
        END IF;
    END IF;

    -- Update the transaction status
    UPDATE transactions SET status = p_new_status WHERE id = p_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'transaction_id', p_transaction_id,
        'status', p_new_status
    );
END;
$$;

-- 3. Prevent unauthorized balance updates via Trigger
CREATE OR REPLACE FUNCTION check_balance_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If balance is changing
  IF OLD.balance IS DISTINCT FROM NEW.balance THEN
    -- Check if it's being done by a non-admin directly via API
    -- In Supabase, the 'authenticator' role is used for API requests.
    -- However, checking the current role might be tricky depending on how it's executed.
    -- A better way is to check if it's an admin if we want to allow admins to bypass.
    -- But ideally even admins should use the RPC.

    -- For now, let's allow the update ONLY if it's a SECURITY DEFINER function (postgres role)
    -- or if the user has admin role.
    IF current_user = 'authenticator' AND NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Direct balance updates are not allowed for users. Use the transaction system.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_direct_balance_update ON profiles;
CREATE TRIGGER prevent_direct_balance_update
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION check_balance_update();
