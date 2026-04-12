import { Wallet, Globe, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function PaymentMethods() {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-bold flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Web3 Connectivity
        </p>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? "bg-profit/10 text-profit" : "bg-white/10 text-muted-foreground"}`}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{isConnected ? "Wallet Connected" : "No Wallet Connected"}</p>
                <p className="text-[10px] text-muted-foreground">{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect your wallet for secure funding"}</p>
              </div>
            </div>
            {isConnected && (
              <span className="px-2 py-0.5 rounded-full bg-profit/10 text-profit text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <ConnectButton accountStatus="address" showBalance={false} chainStatus="none" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Security Note
        </p>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            For your security, we only support Web3 wallet connections and direct blockchain transfers. Bank transfer methods are currently under maintenance to ensure maximum privacy and speed.
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
        onClick={() => window.open('https://metamask.io', '_blank')}
      >
        <ExternalLink className="w-3 h-3" /> Don't have a wallet? Get MetaMask
      </Button>
    </div>
  );
}
