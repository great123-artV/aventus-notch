import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { mockStocks, mockForex } from "@/lib/mock-data";

type TabKey = "all" | "stocks" | "crypto" | "forex";

const Markets = () => {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const { data: cryptoData } = useCryptoPrices();

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
    { key: "all", label: "All" },
    { key: "stocks", label: "Stocks" },
    { key: "crypto", label: "Crypto" },
    { key: "forex", label: "Forex" },
  ];

  return (
    <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Markets</h1>
        <p className="text-muted-foreground mt-1">Explore global investment opportunities</p>
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
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/30 border-glass-border"
          />
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span>Asset</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h Change</span>
          <span className="text-right">Market Cap / Volume</span>
        </div>
        <div className="divide-y divide-border">
          {allAssets.map((asset) => {
            const isPositive = asset.changePercent >= 0;
            return (
              <Link
                key={asset.id}
                to={`/asset/${asset.id}`}
                className="grid sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-6 py-4 hover:bg-secondary/20 transition-colors items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-right">
                  {asset.category === "forex" ? asset.price.toFixed(4) : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? "text-profit" : "text-loss"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isPositive ? "+" : ""}{asset.changePercent.toFixed(2)}%
                </div>
                <p className="text-sm text-muted-foreground text-right hidden sm:block">
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
