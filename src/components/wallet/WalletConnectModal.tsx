import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
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
        
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <ConnectButton />
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed max-w-[280px]">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy. Your private keys are never shared.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
