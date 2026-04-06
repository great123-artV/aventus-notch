import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Copy, Wallet } from "lucide-react";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const walletAddress = "0x35d4248095be1aaf0025f651cf86ed3ec7858023";

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("process_transaction", {
        p_type: "deposit",
        p_amount: Number(amount),
        p_asset: "USDT",
        p_wallet_address: walletAddress
      });

      if (error) throw error;

      toast.success("Deposit initiated successfully! Funds added to your balance.");
      await refreshProfile();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
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
            Send USDT (ERC20) to the address below. Your balance will be updated immediately.
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
            <Label>Wallet Address</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono break-all">
                {walletAddress}
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
            disabled={loading}
            className="w-full gradient-primary border-0 text-white shadow-glow rounded-xl font-bold py-6"
          >
            {loading ? "Processing..." : "I've Sent the Funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
