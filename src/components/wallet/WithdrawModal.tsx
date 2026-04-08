import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowUpRight, Building2, CreditCard, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WithdrawMethod = "wallet" | "bank";

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { balance, user } = useAuth();

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (method === "wallet" && !walletAddress) {
      toast.error("Please enter a destination wallet address");
      return;
    }
    if (method === "bank" && (!bankName || !accountNumber || !routingNumber)) {
      toast.error("Please fill in all bank details");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdrawal" as const,
        method: method === "wallet" ? ("wallet" as const) : ("bank_transfer" as const),
        amount: Number(amount),
        status: "pending" as const,
        wallet_address: method === "wallet" ? walletAddress : null,
        bank_name: method === "bank" ? bankName : null,
        account_number: method === "bank" ? accountNumber : null,
        routing_number: method === "bank" ? routingNumber : null,
        notes: `Withdrawal request via ${method === "wallet" ? "crypto wallet" : "bank transfer"}`,
      });

      if (error) {
        toast.error("Failed to submit withdrawal request");
        console.error(error);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setAmount("");
    setWalletAddress("");
    setBankName("");
    setAccountNumber("");
    setRoutingNumber("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="glass-strong border-white/10 sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold font-display">Withdrawal Submitted</h3>
            <p className="text-muted-foreground max-w-xs">
              Your withdrawal of <span className="text-foreground font-bold">${Number(amount).toLocaleString()}</span> is under review. You'll be notified once approved.
            </p>
            <div className="pt-4 w-full space-y-3">
              <div className="p-4 bg-white/5 rounded-xl text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{method === "wallet" ? "Crypto Wallet" : "Bank Transfer"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-yellow-500 font-bold">Pending Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA</span>
                  <span className="font-medium">{method === "wallet" ? "1-24 hours" : "3-5 business days"}</span>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full gradient-primary border-0 text-white rounded-xl font-bold py-6">Done</Button>
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
            <ArrowUpRight className="w-6 h-6 text-loss" /> Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to receive your funds.
          </DialogDescription>
        </DialogHeader>

        {/* Balance Card */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Balance</span>
          <span className="text-xl font-bold font-display">${balance.toLocaleString()}</span>
        </div>

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
                <Label>Destination Wallet (ERC20)</Label>
                <Input placeholder="0x..." value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Amount (USDT)</Label>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                <button onClick={() => setAmount(String(balance))} className="text-xs text-primary font-bold hover:underline">Withdraw Max</button>
              </div>
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Ensure the address is correct. Withdrawals to wrong addresses cannot be reversed.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="bank" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input placeholder="e.g. Chase Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="****1234" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Routing Number</Label>
                  <Input placeholder="021000021" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                <button onClick={() => setAmount(String(balance))} className="text-xs text-primary font-bold hover:underline">Withdraw Max</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button onClick={handleWithdraw} disabled={loading || !amount} className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Confirm Withdrawal"}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          A 1% processing fee applies. Minimum withdrawal: $50.
        </p>
      </DialogContent>
    </Dialog>
  );
}
