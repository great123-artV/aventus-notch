import React from "react";
import { mockInvestors } from "@/lib/investor-mock-data";
import { TrendingUp } from "lucide-react";

export const InvestorTicker = () => {
  // Use a subset of 100 investors to keep performance smooth (300 total nodes with triplication)
  // while still presenting a diverse set from the 1000 generated mockups.
  const subsetInvestors = mockInvestors.slice(0, 100);
  const tickerItems = [...subsetInvestors, ...subsetInvestors, ...subsetInvestors];

  return (
    <div className="w-full bg-[#0a0f1d]/80 backdrop-blur-md border-b border-white/10 py-1.5 overflow-hidden flex items-center relative z-50">
      <div className="flex gap-8 sm:gap-12 animate-marquee-slow whitespace-nowrap items-center">
        {tickerItems.map((investor, i) => (
          <div key={`${investor.id}-${i}`} className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <span className="font-bold text-white/90">{investor.name}</span>
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-[12px] sm:text-[14px] leading-none">{investor.countryFlag}</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-muted-foreground">
                {investor.countryName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Invested</span>
              <span className="font-mono font-bold text-profit">
                ${investor.amount.toLocaleString()}
              </span>
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-profit/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth fading edges */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#0a0f1d] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#0a0f1d] to-transparent pointer-events-none z-10" />
    </div>
  );
};
