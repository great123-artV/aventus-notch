import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { usePriceSimulation } from "@/hooks/use-price-simulation";
import { mockStocks, mockForex } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

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

  const { getTickPrice, getTickDirection } = usePriceSimulation(
    allAssets.map((a) => ({ id: a.id, price: a.price })),
    2500
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "stocks", label: "Stocks" },
    { key: "crypto", label: "Crypto" },
    { key: "forex", label: "Forex" },
  ];

  return (
    <AnimatedPage>
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1 text-sm">Explore global investment opportunities</p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-1 bg-secondary/40 p-1 rounded-full w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative px-5 py-2 rounded-full text-sm font-medium transition-all"
              >
                {tab === t.key && (
                  <motion.div
                    layoutId="market-tab"
                    className="absolute inset-0 gradient-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className={`relative z-10 ${tab === t.key ? "text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30 border-border rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          className="glass overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h Change</span>
            <span className="text-right">Market Cap</span>
          </div>
          <div className="divide-y divide-border">
            {allAssets.map((asset, i) => {
              const livePrice = getTickPrice(asset.id, asset.price);
              const direction = getTickDirection(asset.id);
              const isPositive = asset.changePercent >= 0;

              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link
                    to={`/asset/${asset.id}`}
                    className="group grid sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-6 py-4 hover:bg-secondary/30 transition-all duration-200 items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xs font-bold group-hover:bg-secondary/80 transition-colors">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>

                    {/* Animated Price */}
                    <div className="text-right relative">
                      <AnimatePresence mode="popLayout">
                        <motion.p
                          key={livePrice.toFixed(4)}
                          className={`text-sm font-semibold tabular-nums ${
                            direction === "up" ? "text-profit" :
                            direction === "down" ? "text-loss" :
                            "text-foreground"
                          }`}
                          initial={{ opacity: 0.6, y: direction === "up" ? 6 : direction === "down" ? -6 : 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          {asset.category === "forex"
                            ? livePrice.toFixed(4)
                            : `$${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </motion.p>
                      </AnimatePresence>
                      {direction !== "neutral" && (
                        <motion.div
                          className={`absolute inset-0 rounded-lg ${direction === "up" ? "bg-profit/8" : "bg-loss/8"}`}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </div>

                    <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isPositive ? "text-profit" : "text-loss"}`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isPositive ? "+" : ""}{asset.changePercent.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground text-right hidden sm:block tabular-nums">
                      {"marketCap" in asset ? (asset as any).marketCap : asset.volume}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Markets;
