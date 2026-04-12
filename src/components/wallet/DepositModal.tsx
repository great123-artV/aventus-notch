import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Copy, Wallet, Loader2, Building2, CreditCard, CheckCircle2 } from "lucide-react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther } from "viem";
import { motion, AnimatePresence } from "framer-motion";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DepositMethod = "wallet";

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<DepositMethod>("wallet");
  const [lastSentAmount, setLastSentAmount] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { isConnected } = useAccount();
  const treasuryAddress = "0x35d4248095be1aaf0025f651cf86ed3ec7858023";

  const { data: hash, sendTransaction, isPending, error: sendError, reset } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleWalletDeposit = async () => {
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
          await supabase.from("transactions").insert({
            user_id: user.id,
            type: "deposit" as const,
            method: "wallet" as const,
            amount: Number(lastSentAmount),
            status: "completed" as const,
            tx_hash: hash,
            notes: "Wallet deposit confirmed on-chain",
          });

          const { error } = await supabase.from("investments").insert({
            user_id: user.id,
            asset_name: "Deposit via Wallet",
            asset_type: "deposit",
            amount_invested: Number(lastSentAmount),
            current_value: Number(lastSentAmount),
          });

          if (error) {
            toast.error("Failed to record deposit");
          } else {
            toast.success("Deposit confirmed and recorded!");
            await refreshProfile();
            handleClose();
          }
        } finally {
          setIsRecording(false);
        }
      };
      recordDeposit();
    }
  }, [isConfirmed, user, hash, lastSentAmount, isRecording]);

  useEffect(() => {
    if (sendError) toast.error(sendError.message || "Transaction failed");
  }, [sendError]);

  const handleClose = () => {
    onOpenChange(false);
    setAmount("");
    setLastSentAmount(null);
    reset();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    toast.success("Address copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Deposit Funds
          </DialogTitle>
          <DialogDescription>
            Deposit ETH via your connected crypto wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Network</Label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">Ethereum (ERC20)</div>
          </div>
          <div className="space-y-2">
            <Label>Treasury Address</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono break-all">{treasuryAddress}</div>
              <Button size="icon" variant="outline" onClick={copyAddress} className="shrink-0 rounded-xl"><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Amount (ETH)</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
          </div>
          <Button
            onClick={handleWalletDeposit}
            disabled={isPending || isConfirming || !amount}
            className="w-full gradient-primary border-0 text-[#050505] shadow-glow rounded-xl font-bold py-6"
          >
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming in Wallet...</> :
              isConfirming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Waiting for Confirmation...</> :
              "Send Funds"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
