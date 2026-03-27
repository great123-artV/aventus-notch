import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';
import { activities } from '@/lib/mockData';

export const GlobalActivityTicker = () => {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-2 overflow-hidden flex items-center gap-10">
      <div className="flex items-center gap-2 px-4 shrink-0 border-r border-white/10 pr-6 z-10 bg-black/40 backdrop-blur-md">
        <Globe className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Live Global Activity</span>
      </div>

      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {activities.concat(activities.slice(0, 100)).map((item, i) => (
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
