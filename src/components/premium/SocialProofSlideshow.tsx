import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User } from 'lucide-react';

const mockWins = [
  { id: 1, user: "James K.", location: "London, UK", invested: 5000, returned: 12400, asset: "Bitcoin" },
  { id: 2, user: "Sarah M.", location: "New York, USA", invested: 1200, returned: 3100, asset: "Tesla Stock" },
  { id: 3, user: "Ahmed Y.", location: "Dubai, UAE", invested: 25000, returned: 68000, asset: "Real Estate" },
  { id: 4, user: "Elena P.", location: "Berlin, Germany", invested: 800, returned: 2200, asset: "Ethereum" },
  { id: 5, user: "Chen L.", location: "Singapore", invested: 15000, returned: 34500, asset: "Gold" },
];

export const SocialProofSlideshow = ({ compact = false }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % mockWins.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = mockWins[index];

  return (
    <div className={`relative overflow-hidden ${compact ? 'h-24' : 'h-48'} w-full`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`glass-card p-4 flex items-center gap-4 ${compact ? 'h-full' : 'h-full'}`}
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="text-primary w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-lg">{current.user}</h4>
              <span className="text-xs text-muted-foreground">{current.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">Invested</p>
                <p className="font-mono font-bold">${current.invested.toLocaleString()}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase text-profit font-semibold">Returned</p>
                <p className="font-mono font-bold text-profit flex items-center gap-1">
                  ${current.returned.toLocaleString()}
                  <TrendingUp className="w-3 h-3" />
                </p>
              </div>
              {!compact && (
                <>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Asset</p>
                    <p className="font-bold text-sm">{current.asset}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
