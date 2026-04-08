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

type DepositMethod = "wallet" | "bank";

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<DepositMethod>("wallet");
  const [lastSentAmount, setLastSentAmount] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [bankSubmitted, setBankSubmitted] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { isConnected } = useAccount();
  const treasuryAddress = "0x35d4248095be1aaf0025f651cf86ed3ec7858023";

  const { data: hash, sendTransaction, isPending, error: sendError, reset } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const presetAmounts = [100, 500, 1000, 5000];

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

  const handleBankDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!user) return;

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "deposit" as const,
      method: "bank_transfer" as const,
      amount: Number(amount),
      status: "pending" as const,
      notes: "Bank transfer deposit - awaiting confirmation",
    });

    if (error) {
      toast.error("Failed to submit deposit request");
      console.error(error);
    } else {
      setBankSubmitted(true);
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
    setBankSubmitted(false);
    reset();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    toast.success("Address copied to clipboard");
  };

  if (bankSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="glass-strong border-white/10 sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-profit/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-profit" />
            </div>
            <h3 className="text-2xl font-bold font-display">Deposit Submitted!</h3>
            <p className="text-muted-foreground max-w-xs">
              Your bank transfer of <span className="text-foreground font-bold">${Number(amount).toLocaleString()}</span> is being processed. Funds will appear in your account within 1-3 business days.
            </p>
            <div className="pt-4 w-full space-y-3">
              <div className="p-4 bg-white/5 rounded-xl text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">AVN-{Date.now().toString(36).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-yellow-500 font-bold">Pending</span>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full gradient-primary border-0 text-white rounded-xl font-bold py-6">
                Done
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Deposit Funds
          </DialogTitle>
          <DialogDescription>
            Choose your preferred deposit method below.
          </DialogDescription>
        </DialogHeader>

        {/* Method Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setMethod("wallet")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              method === "wallet" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Crypto Wallet
          </button>
          <button
            onClick={() => setMethod("bank")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              method === "bank" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" /> Bank Transfer
          </button>
        </div>

        <AnimatePresence mode="wait">
          {method === "wallet" ? (
            <motion.div key="wallet" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4 py-2">
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
                className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6"
              >
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming in Wallet...</> :
                 isConfirming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Waiting for Confirmation...</> :
                 "Send Funds"}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="bank" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 py-2">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                <p className="text-sm font-bold text-primary">Bank Transfer Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">Aventus-Notch Capital LLC</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-mono">****7842</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Routing</span><span className="font-mono">021000021</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SWIFT</span><span className="font-mono">AVNTUS33</span></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                <div className="flex gap-2 pt-1">
                  {presetAmounts.map((preset) => (
                    <button key={preset} onClick={() => setAmount(String(preset))} className="flex-1 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleBankDeposit} disabled={!amount} className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6">
                Submit Deposit Request
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">Funds typically arrive within 1-3 business days</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
