import { CreditCard, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentMethods() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">Visa Ending in 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/26</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Default</span>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">MetaMask Wallet</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
        </div>
        <span className="text-profit text-[10px] font-bold uppercase tracking-widest">Active</span>
      </div>

      <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-white/20 hover:border-primary/50 bg-transparent gap-2">
        <Plus className="w-5 h-5" /> Add New Method
      </Button>
    </div>
  );
}
