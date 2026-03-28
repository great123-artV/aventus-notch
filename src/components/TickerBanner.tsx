import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { mockStocks } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const tickerStocks = mockStocks.slice(0, 5);

export function TickerBanner() {
  const { data: crypto } = useCryptoPrices();
  const cryptoItems = (crypto || []).slice(0, 5);

  const items = [
    ...tickerStocks.map((s) => ({ symbol: s.symbol, price: s.price, change: s.changePercent, isCrypto: false })),
    ...cryptoItems.map((c) => ({ symbol: c.symbol, price: c.price, change: c.changePercent, isCrypto: true })),
  ];

  // Double items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full bg-card/90 backdrop-blur-md border-b border-glass-border overflow-hidden">
      <motion.div
        className="flex items-center gap-8 py-2 px-4 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => {
          const isPos = item.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 text-xs font-medium shrink-0">
              {item.isCrypto && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              )}
              <span className="text-foreground font-semibold">{item.symbol}</span>
              <span className="text-muted-foreground">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center gap-0.5 ${isPos ? "text-profit" : "text-loss"}`}>
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPos ? "+" : ""}{item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
