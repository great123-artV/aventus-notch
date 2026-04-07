import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Wallet, Loader2, ExternalLink } from "lucide-react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { isConnected, address: userAddress, chain } = useAccount();
  const treasuryAddress = "0x35d4248095be1aaf0025f651cf86ed3ec7858023";

  const chainSymbol = chain?.nativeCurrency?.symbol || "ETH";
  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";

  const { data: hash, sendTransaction, isPending, error: sendError } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const recordDeposit = useCallback(async () => {
    try {
      const { error } = await supabase.from("investments").insert({
        user_id: user?.id || "",
        asset_name: "Crypto Deposit",
        asset_type: "deposit",
        amount_invested: Number(amount),
        current_value: Number(amount),
      });

      if (error) throw error;

      toast.success("Deposit confirmed and balance updated!");
      await refreshProfile();
      onOpenChange(false);
      setAmount("");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Balance update failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [user, amount, refreshProfile, onOpenChange]);

  useEffect(() => {
    if (isConfirmed && user) {
      recordDeposit();
    }
  }, [isConfirmed, user, recordDeposit]);

  useEffect(() => {
    if (sendError) {
      toast.error(sendError.message || "Transaction failed");
      setIsProcessing(false);
    }
  }, [sendError]);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      sendTransaction({
        to: treasuryAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Transaction failed");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Fund Account
          </DialogTitle>
          <DialogDescription>
            Send funds directly from your connected wallet to your investment account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected ? (
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
              Please connect your wallet in the dashboard before making a deposit.
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-profit/10 border border-profit/20 text-profit text-xs font-mono break-all">
              Connected: {userAddress}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Deposit</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl pr-16"
                disabled={isPending || isConfirming}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                {chainSymbol}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Funds will be sent to: <span className="font-mono">{treasuryAddress.slice(0, 6)}...{treasuryAddress.slice(-4)}</span>
            </p>
          </div>

          {(isPending || isConfirming) && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isPending ? "Waiting for wallet confirmation..." : "Confirming transaction on-chain..."}</span>
              </div>
              {hash && (
                <a
                  href={`${explorerUrl}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleDeposit}
            disabled={!isConnected || isPending || isConfirming || !amount}
            className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6 h-auto"
          >
            {isPending ? "Confirm in Wallet..." : isConfirming ? "Confirming..." : "Deposit Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
