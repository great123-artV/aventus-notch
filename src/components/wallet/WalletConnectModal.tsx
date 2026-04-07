import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { address, isConnected } = useAccount();
  const { user } = useAuth();

  useEffect(() => {
    const updateProfileWallet = async () => {
      if (isConnected && address && user && open) {
        // First check if it's already linked to avoid redundant updates
        const { data: profile } = await supabase
          .from("profiles")
          .select("wallet_address")
          .eq("user_id", user.id)
          .single();

        if (profile?.wallet_address === address) {
          onOpenChange(false);
          return;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ wallet_address: address })
          .eq("user_id", user.id);

        if (error) {
          console.error("Error updating profile wallet:", error);
        } else {
          toast.success("Wallet address linked to your profile");
          onOpenChange(false);
        }
      }
    };

    if (isConnected && open) {
      updateProfileWallet();
    }
  }, [isConnected, address, user, onOpenChange, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your crypto wallet for faster deposits and withdrawals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8">
          <ConnectButton />
        </div>

        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy. Your private keys are never shared.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
