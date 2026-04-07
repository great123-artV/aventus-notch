import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet, ExternalLink, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const wallets = [
  { 
    name: "MetaMask", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/100px-MetaMask_Fox.svg.png",
    color: "from-orange-500/20 to-orange-600/5",
    popular: true,
  },
  { 
    name: "WalletConnect", 
    icon: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
    color: "from-blue-500/20 to-blue-600/5",
    popular: true,
  },
  { 
    name: "Coinbase Wallet", 
    icon: "https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo-300x300.webp",
    color: "from-blue-600/20 to-blue-700/5",
    popular: false,
  },
  { 
    name: "Trust Wallet", 
    icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
    color: "from-cyan-500/20 to-cyan-600/5",
    popular: false,
  },
  { 
    name: "Phantom", 
    icon: "https://phantom.app/img/phantom-logo.svg",
    color: "from-purple-500/20 to-purple-600/5",
    popular: false,
  },
];

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);

  const handleConnect = async (walletName: string) => {
    setConnecting(walletName);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnecting(null);
    setConnected(walletName);
    toast.success(`${walletName} connected successfully!`);
    
    setTimeout(() => {
      onOpenChange(false);
      setConnected(null);
    }, 1500);
  };

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
        
        <div className="space-y-3 py-4">
          {wallets.map((wallet, i) => (
            <motion.button
              key={wallet.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleConnect(wallet.name)}
              disabled={connecting !== null}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group
                ${connected === wallet.name 
                  ? 'border-profit/50 bg-profit/10' 
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                }
                ${connecting && connecting !== wallet.name ? 'opacity-40' : ''}
              `}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center overflow-hidden`}>
                <img 
                  src={wallet.icon} 
                  alt={wallet.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{wallet.name}</span>
                  {wallet.popular && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">Popular</span>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                {connecting === wallet.name ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : connected === wallet.name ? (
                  <Check className="w-5 h-5 text-profit" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </motion.button>
          ))}
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
