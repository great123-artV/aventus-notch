import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';

const activities = [
  { country: "Japan", user: "Yuki", action: "Invested", amount: "¥1,200,000", asset: "S&P 500" },
  { country: "Nigeria", user: "Obinna", action: "Withdrew", amount: "₦4,500,000", asset: "USDT" },
  { country: "Brazil", user: "Isabela", action: "Invested", amount: "R$8,500", asset: "Solana" },
  { country: "France", user: "Luc", action: "Invested", amount: "€12,000", asset: "Bitcoin" },
  { country: "Canada", user: "Ryan", action: "Profit", amount: "C$4,200", asset: "Forex: EUR/USD" },
  { country: "Australia", user: "Liam", action: "Invested", amount: "A$22,000", asset: "Real Estate" },
  { country: "India", user: "Priya", action: "Profit", amount: "₹1,50,000", asset: "Ethereum" },
];

export const GlobalActivityTicker = () => {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-2 overflow-hidden flex items-center gap-10">
      <div className="flex items-center gap-2 px-4 shrink-0 border-r border-white/10 pr-6">
        <Globe className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Live Global Activity</span>
      </div>

      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {activities.concat(activities).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-medium text-white/80">{item.user} ({item.country})</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
              item.action === "Profit" ? "bg-profit/20 text-profit" :
              item.action === "Withdrew" ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
            }`}>
              {item.action}
            </span>
            <span className="text-xs font-mono font-bold">{item.amount}</span>
            <span className="text-xs text-muted-foreground">{item.asset}</span>
            <ArrowUpRight className="w-3 h-3 text-profit/60" />
          </div>
        ))}
      </div>
    </div>
  );
};
