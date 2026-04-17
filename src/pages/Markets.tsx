import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, CheckCircle2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { mockStocks, mockForex } from "@/lib/mock-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type TabKey = "all" | "stocks" | "crypto" | "forex";

const Markets = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [planAmount, setPlanAmount] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { data: cryptoData } = useCryptoPrices();

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setPlanAmount(plan);
      setIsConfirming(true);
    }
  }, [searchParams]);

  const handleConfirmPlan = () => {
    setIsConfirming(false);
    toast.success(`Investment plan of $${planAmount} started successfully!`, {
      icon: <CheckCircle2 className="w-5 h-5 text-profit" />
    });
    // Remove the plan param from URL
    setSearchParams({});
    // Redirect to dashboard after a short delay
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const allAssets = useMemo(() => {
    const crypto = (cryptoData || []).map((c) => ({ ...c, category: "crypto" as const }));
    const all = [...mockStocks, ...crypto, ...mockForex];
    return all.filter((a) => {
      const matchTab = tab === "all" || a.category === tab;
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [tab, search, cryptoData]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: t("markets.all") },
    { key: "stocks", label: t("markets.stocks") },
    { key: "crypto", label: t("markets.crypto") },
    { key: "forex", label: t("markets.forex") },
  ];

  return (
    <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto theme-markets relative">
      <Dialog open={isConfirming} onOpenChange={(open) => {
        setIsConfirming(open);
        if (!open) setSearchParams({});
      }}>
        <DialogContent className="glass-strong border-white/10 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
              Confirm Investment
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-4 text-lg">
              You are about to start an investment plan of <span className="text-primary font-bold">${Number(planAmount).toLocaleString()}</span>.
              <br /><br />
              This amount will be dedicated to your active portfolio growth for the next 48 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="glass p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Investment Amount</span>
                <span className="font-bold">${Number(planAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Return</span>
                <span className="font-bold text-profit">
                  ${(Number(planAmount) * (planAmount === '100' ? 20.5 : planAmount === '200' ? 17.5 : planAmount === '300' ? 18.33 : planAmount === '500' ? 15 : 12.5)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold text-yellow-500">48 Hours</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsConfirming(false)} className="hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleConfirmPlan} className="gradient-primary border-0 text-[#050505] font-bold shadow-glow">
              Confirm & Start Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display">{t("markets.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("markets.subtitle")}</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-1 glass p-1 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("markets.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/30 border-glass-border"
          />
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span>{t("markets.asset")}</span>
          <span className="text-right">{t("markets.price")}</span>
          <span className="text-right">{t("markets.change")}</span>
          <span className="text-right">{t("markets.marketCap")}</span>
        </div>
        <div className="divide-y divide-border">
          {allAssets.map((asset) => {
            const isPositive = asset.changePercent >= 0;
            return (
              <Link
                key={asset.id}
                to={`/asset/${asset.id}`}
                className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-secondary/20 transition-colors items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/50 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">{asset.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                </div>

                {/* Mobile: Price and Change stack on the right. Desktop: separate columns */}
                <div className="flex flex-col items-end sm:contents">
                  <p className="text-xs sm:text-sm font-medium text-right order-1">
                    {asset.category === "forex" ? asset.price.toFixed(4) : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                  <div className={`flex items-center justify-end gap-1 text-[10px] sm:text-sm font-medium order-2 sm:order-3 ${isPositive ? "text-profit" : "text-loss"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                    {isPositive ? "+" : ""}{asset.changePercent.toFixed(2)}%
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-right hidden sm:block order-4">
                  {"marketCap" in asset ? (asset as any).marketCap : asset.volume}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Markets;
