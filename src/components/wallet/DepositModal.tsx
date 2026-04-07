import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Copy, Wallet, Loader2 } from "lucide-react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther } from "viem";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [lastSentAmount, setLastSentAmount] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { isConnected } = useAccount();
  const treasuryAddress = "0x35d4248095be1aaf0025f651cf86ed3ec7858023";

  const { data: hash, sendTransaction, isPending, error: sendError, reset } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!user) return;
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setLastSentAmount(amount);
      sendTransaction({
        to: treasuryAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
      setLastSentAmount(null);
    }
  };

  useEffect(() => {
    if (isConfirmed && user && hash && lastSentAmount && !isRecording) {
      const recordDeposit = async () => {
        setIsRecording(true);
        try {
          const { error } = await supabase.from("investments").insert({
            user_id: user.id,
            asset_name: "Deposit via Wallet",
            asset_type: "deposit",
            amount_invested: Number(lastSentAmount),
            current_value: Number(lastSentAmount),
          });

          if (error) {
            toast.error("Failed to record deposit in database");
            console.error(error);
          } else {
            toast.success("Deposit successful and recorded!");
            await refreshProfile();
            onOpenChange(false);
            setAmount("");
            setLastSentAmount(null);
            reset(); // Clear hash to prevent duplicate triggers
          }
        } finally {
          setIsRecording(false);
        }
      };
      recordDeposit();
    }
  }, [isConfirmed, user, hash, lastSentAmount, isRecording, refreshProfile, onOpenChange, reset]);

  useEffect(() => {
    if (sendError) {
      toast.error(sendError.message || "Transaction failed");
    }
  }, [sendError]);

  const copyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    toast.success("Address copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Deposit USDT
          </DialogTitle>
          <DialogDescription>
            Send USDT (ERC20) to the address below. Your balance will be updated.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Network</Label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
              Ethereum (ERC20)
            </div>
          </div>
          <div className="space-y-2">
            <Label>Treasury Address (ETH)</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono break-all">
                {treasuryAddress}
              </div>
              <Button size="icon" variant="outline" onClick={copyAddress} className="shrink-0 rounded-xl">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDeposit}
            disabled={isPending || isConfirming || !amount}
            className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming in Wallet...
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Waiting for Confirmation...
              </>
            ) : (
              "Send Funds"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
