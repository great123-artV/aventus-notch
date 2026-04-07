import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingViewChart } from "@/components/premium/TradingViewWidget";
import { mockStocks, mockForex, generateChartData } from "@/lib/mock-data";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { TransactionModal } from "@/components/wallet/TransactionModal";

const ranges = [
  { key: "1D", days: 1 },
  { key: "1W", days: 7 },
  { key: "1M", days: 30 },
  { key: "1Y", days: 365 },
];

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [range, setRange] = useState("1M");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
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
    <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
      <Link to="/markets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Markets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-sm font-bold">
              {asset.symbol.slice(0, 2)}
            </div>
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
          <Button
            onClick={() => setIsBuyModalOpen(true)}
            className="gradient-primary border-0 text-foreground shadow-glow px-8 rounded-xl font-bold"
          >
            Buy
          </Button>
          <Button
            onClick={() => setIsSellModalOpen(true)}
            variant="outline"
            className="bg-secondary/30 border-glass-border px-8 rounded-xl font-bold"
          >
            Sell
          </Button>
        </div>
      </div>

      <TransactionModal
        open={isBuyModalOpen}
        onOpenChange={setIsBuyModalOpen}
        asset={asset}
        type="buy"
      />
      <TransactionModal
        open={isSellModalOpen}
        onOpenChange={setIsSellModalOpen}
        asset={asset}
        type="sell"
      />

      {/* Chart */}
      <div className="mb-6 h-[500px]">
        <TradingViewChart
          symbol={asset.category === 'crypto' ? `BINANCE:${asset.symbol}USDT` :
                 asset.category === 'stocks' ? `NASDAQ:${asset.symbol}` :
                 asset.category === 'forex' ? `FX_IDC:${asset.symbol.replace('/', '')}` :
                 `BINANCE:${asset.symbol}USDT`}
          containerHeight="100%"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BarChart3, label: "Market Cap", value: ("marketCap" in asset ? (asset as { marketCap?: string }).marketCap : "N/A") },
          { icon: Activity, label: "Volume", value: asset.volume || "N/A" },
          { icon: DollarSign, label: "24h High", value: `$${(asset.price * 1.015).toFixed(2)}` },
          { icon: DollarSign, label: "24h Low", value: `$${(asset.price * 0.985).toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="glass p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="font-semibold text-sm">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="glass p-6 rounded-xl border-primary/20">
        <h3 className="font-semibold font-display mb-3">Market Insights</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>• Strong institutional buying pressure detected in the last 24 hours.</p>
          <p>• Technical indicators suggest a bullish trend continuation above current support levels.</p>
          <p>• Analysts maintain a consensus "Buy" rating with an average price target 15% above current levels.</p>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
