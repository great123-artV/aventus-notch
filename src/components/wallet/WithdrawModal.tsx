import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { balance } = useAuth();

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!address) {
      toast.error("Please enter a destination address");
      return;
    }
    if (Number(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      // In production, this would create a withdrawal request for admin review
      toast.success("Withdrawal request submitted! Admin will review shortly.");
      onOpenChange(false);
      setAmount("");
      setAddress("");
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-loss" /> Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Withdraw your funds to an external USDT (ERC20) wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="font-bold">${balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Destination Wallet (ERC20)</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl"
            />
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
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6"
          >
            {loading ? "Processing..." : "Confirm Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
