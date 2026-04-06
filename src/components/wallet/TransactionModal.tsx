import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    category: string;
  };
  type: "buy" | "sell";
}

export function TransactionModal({ open, onOpenChange, asset, type }: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, balance, refreshProfile } = useAuth();

  const handleTransaction = async () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (type === "buy" && numAmount > balance) {
      toast.error("Insufficient balance for this purchase");
      return;
    }

    if (!user) {
      toast.error("Please log in to trade");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("process_transaction", {
        p_type: type === "buy" ? "withdrawal" : "deposit", // Using withdrawal to deduct balance on buy, and deposit to add on sell
        p_amount: numAmount,
        p_asset: asset.symbol,
        p_wallet_address: "PLATFORM_INTERNAL"
      });

      if (error) throw error;

      toast.success(`${type === "buy" ? "Bought" : "Sold"} ${asset.name} successfully!`);
      await refreshProfile();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const totalValue = (Number(amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2 capitalize">
            {type === "buy" ? (
              <TrendingUp className="w-6 h-6 text-profit" />
            ) : (
              <TrendingDown className="w-6 h-6 text-loss" />
            )}
            {type} {asset.name}
          </DialogTitle>
          <DialogDescription>
            {type === "buy" ? "Purchase" : "Sell"} {asset.name} ({asset.symbol}) at current market rates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="font-bold">${balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="font-bold">${asset.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount in USD</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl pl-9"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Roughly {(Number(amount) / asset.price).toFixed(6)} {asset.symbol}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleTransaction}
            disabled={loading}
            className={`w-full border-0 text-white shadow-glow rounded-xl font-bold py-6 ${
              type === "buy" ? "gradient-primary" : "bg-loss hover:bg-loss/90"
            }`}
          >
            {loading ? "Processing..." : `Confirm ${type.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
