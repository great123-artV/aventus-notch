import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TradingViewChart } from "@/components/premium/TradingViewWidget";
import { LineChart, Globe, Zap, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'forex'>('crypto');

  const cryptoAssets = [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", price: "$68,420", change: "+2.4%" },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum", price: "$3,850", change: "+1.8%" },
    { symbol: "BINANCE:SOLUSDT", name: "Solana", price: "$145.20", change: "+5.6%" },
    { symbol: "BINANCE:ADAUSDT", name: "Cardano", price: "$0.45", change: "-0.5%" },
  ];

  const forexAssets = [
    { symbol: "FX:EURUSD", name: "EUR/USD", price: "1.0854", change: "+0.12%" },
    { symbol: "FX:GBPUSD", name: "GBP/USD", price: "1.2642", change: "+0.25%" },
    { symbol: "FX:USDJPY", name: "USD/JPY", price: "150.42", change: "-0.15%" },
    { symbol: "FX:AUDUSD", name: "AUD/USD", price: "0.6542", change: "+0.45%" },
  ];

  const currentAssets = activeTab === 'crypto' ? cryptoAssets : forexAssets;
  const [selectedSymbol, setSelectedSymbol] = useState(currentAssets[0].symbol);

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">Market Analysis</h1>
            <p className="text-muted-foreground">Professional-grade charts and real-time market insights.</p>
          </div>
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => { setActiveTab('crypto'); setSelectedSymbol(cryptoAssets[0].symbol); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'crypto' ? 'bg-primary text-white shadow-glow' : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              Cryptocurrency
            </button>
            <button
              onClick={() => { setActiveTab('forex'); setSelectedSymbol(forexAssets[0].symbol); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'forex' ? 'bg-primary text-white shadow-glow' : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Forex Trading
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              {currentAssets.map((asset) => (
                <motion.div
                  key={asset.symbol}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedSymbol(asset.symbol)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedSymbol === asset.symbol
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{asset.name}</span>
                    <span className={`text-xs font-bold ${asset.change.startsWith('+') ? 'text-profit' : 'text-red-400'}`}>
                      {asset.change}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{asset.symbol.split(':')[1]}</span>
                    <span className="font-mono">{asset.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 mt-8">
              <h4 className="font-bold mb-2">AI Signal Alert</h4>
              <p className="text-sm text-muted-foreground mb-4">Strong bullish divergence detected on {currentAssets[0].name} 4H timeframe.</p>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white border-0">
                View Signal
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card p-2 rounded-3xl h-[600px] overflow-hidden">
              <TradingViewChart symbol={selectedSymbol} />
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {[
                { label: "Market Volatility", value: "Medium", color: "text-blue-400" },
                { label: "Trading Volume", value: "$2.4B (24h)", color: "text-profit" },
                { label: "Fear & Greed Index", value: "64 (Greed)", color: "text-orange-400" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-6 rounded-2xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">{stat.label}</p>
                  <p className={`text-xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
