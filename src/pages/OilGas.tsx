import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, ShieldCheck, Globe, ArrowRight, Droplets, Fuel, Factory } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TradingViewChart } from "@/components/premium/TradingViewWidget";

const OilGas = () => {
  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-orange-500 mb-6 border-orange-500/20">
            <Droplets className="w-4 h-4" />
            <span className="font-medium uppercase tracking-wider">Energy & Commodities</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display mb-6">
            Invest in <span className="text-gradient-orange">Global Energy.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Access high-yield opportunities in oil production, natural gas distribution, and renewable energy infrastructure.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Fuel,
              title: "Crude Oil",
              desc: "Direct exposure to WTI and Brent crude price movements and production dividends.",
              roi: "12-18% Est. APY",
              color: "text-orange-500"
            },
            {
              icon: Droplets,
              title: "Natural Gas",
              desc: "Invest in the transition fuel of the future with global distribution networks.",
              roi: "10-15% Est. APY",
              color: "text-blue-400"
            },
            {
              icon: Factory,
              title: "Energy Infra",
              desc: "Stable returns from pipelines, storage facilities, and refinery operations.",
              roi: "8-12% Est. APY",
              color: "text-emerald-400"
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {item.desc}
              </p>
              <div className="flex items-center justify-between py-4 border-t border-white/5">
                <span className="text-sm font-medium text-muted-foreground">Target Returns</span>
                <span className={`font-bold ${item.color}`}>{item.roi}</span>
              </div>
              <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 border-white/10">
                View Details
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-orange-500" />
              Market Analysis: WTI Crude
            </h3>
            <TradingViewChart symbol="TVC:USOIL" />
          </div>
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="text-blue-400" />
              Global Energy Insights
            </h3>
            <div className="space-y-6">
              {[
                { title: "OPEC+ Production Trends", status: "Neutral", impact: "High" },
                { title: "Natural Gas Inventory", status: "Bullish", impact: "Medium" },
                { title: "Strategic Reserve Updates", status: "Bearish", impact: "High" }
              ].map((news) => (
                <div key={news.title} className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold mb-1">{news.title}</h4>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Impact: {news.impact}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                    news.status === 'Bullish' ? 'text-profit bg-profit/10' :
                    news.status === 'Bearish' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'
                  }`}>
                    {news.status}
                  </span>
                </div>
              ))}
              <div className="p-6 rounded-2xl gradient-orange text-white">
                <h4 className="text-xl font-bold mb-2">New Investment Opportunity</h4>
                <p className="text-white/80 text-sm mb-4">Offshore production facility in the Gulf of Mexico. Expected 15.5% annual yield.</p>
                <Button className="w-full bg-black/20 hover:bg-black/30 border-0 text-white">
                  Get Early Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilGas;
