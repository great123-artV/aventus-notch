import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { mockStocks, mockForex, generateChartData } from "@/lib/mock-data";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const ranges = [
  { key: "1D", days: 1 },
  { key: "1W", days: 7 },
  { key: "1M", days: 30 },
  { key: "1Y", days: 365 },
];

// Map asset IDs to TradingView symbols
const tvSymbolMap: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  binancecoin: "BINANCE:BNBUSDT",
  solana: "BINANCE:SOLUSDT",
  ripple: "BINANCE:XRPUSDT",
  cardano: "BINANCE:ADAUSDT",
  dogecoin: "BINANCE:DOGEUSDT",
  polkadot: "BINANCE:DOTUSDT",
  eurusd: "FX:EURUSD",
  gbpusd: "FX:GBPUSD",
  usdjpy: "FX:USDJPY",
  usdchf: "FX:USDCHF",
  audusd: "FX:AUDUSD",
  aapl: "NASDAQ:AAPL",
  tsla: "NASDAQ:TSLA",
  msft: "NASDAQ:MSFT",
  amzn: "NASDAQ:AMZN",
  googl: "NASDAQ:GOOGL",
  nvda: "NASDAQ:NVDA",
  meta: "NASDAQ:META",
  jpm: "NYSE:JPM",
};

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [range, setRange] = useState("1M");
  const { data: cryptoData } = useCryptoPrices();

  const asset = useMemo(() => {
    const all = [...mockStocks, ...(cryptoData || []), ...mockForex];
    return all.find((a) => a.id === id);
  }, [id, cryptoData]);

  const selectedRange = ranges.find((r) => r.key === range) || ranges[2];
  const chartData = useMemo(
    () => generateChartData(selectedRange.days, asset?.price || 100, (asset?.price || 100) * 0.02),
    [selectedRange.days, asset?.price]
  );

  const tvSymbol = id ? tvSymbolMap[id] : undefined;
  const isTradingViewAsset = !!tvSymbol && (asset?.category === "crypto" || asset?.category === "forex");

  if (!asset) {
    return (
      <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">Asset not found</p>
        <Link to="/markets"><Button className="mt-4">Back to Markets</Button></Link>
      </div>
    );
  }

  const isPositive = asset.changePercent >= 0;

  return (
    <AnimatedPage>
      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <Link to="/markets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Markets
        </Link>

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-sm font-bold"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {asset.symbol.slice(0, 2)}
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold font-display">{asset.name}</h1>
                <span className="text-sm text-muted-foreground">{asset.symbol}</span>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold font-display">
                {asset.category === "forex" ? asset.price.toFixed(4) : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
              <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-profit" : "text-loss"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? "+" : ""}{asset.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="gradient-primary border-0 text-foreground shadow-glow">Buy</Button>
            <Button variant="outline" className="bg-secondary/30 border-glass-border">Sell</Button>
          </div>
        </motion.div>

        {/* TradingView for Crypto & Forex */}
        {isTradingViewAsset && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold font-display mb-3 text-sm text-muted-foreground">Advanced Analysis — TradingView</h3>
            <TradingViewWidget symbol={tvSymbol!} height={450} />
          </motion.div>
        )}

        {/* Recharts Chart */}
        <motion.div
          className="glass p-6 rounded-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isTradingViewAsset ? 0.2 : 0.1 }}
        >
          <div className="flex gap-1 mb-4">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  range === r.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="assetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "hsl(222, 41%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Price"]}
              />
              <Area type="monotone" dataKey="price" stroke={isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)"} strokeWidth={2} fill="url(#assetGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: BarChart3, label: "Market Cap", value: ("marketCap" in asset ? (asset as any).marketCap : "N/A") },
            { icon: Activity, label: "Volume", value: asset.volume || "N/A" },
            { icon: DollarSign, label: "24h High", value: `$${(asset.price * 1.015).toFixed(2)}` },
            { icon: DollarSign, label: "24h Low", value: `$${(asset.price * 0.985).toFixed(2)}` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="glass p-4 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="font-semibold text-sm">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Insights */}
        <motion.div
          className="glass p-6 rounded-xl border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold font-display mb-3">Market Insights</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Strong institutional buying pressure detected in the last 24 hours.</p>
            <p>• Technical indicators suggest a bullish trend continuation above current support levels.</p>
            <p>• Analysts maintain a consensus "Buy" rating with an average price target 15% above current levels.</p>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default AssetDetail;
