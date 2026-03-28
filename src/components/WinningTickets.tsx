import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Trophy, Sparkles } from "lucide-react";

const winners = [
  { name: "James M.", avatar: "JM", invested: 5000, gained: 12450, asset: "Bitcoin", time: "2 min ago", flag: "🇺🇸" },
  { name: "Sarah K.", avatar: "SK", invested: 12000, gained: 28800, asset: "NVIDIA", time: "5 min ago", flag: "🇬🇧" },
  { name: "Ahmed R.", avatar: "AR", invested: 8500, gained: 19200, asset: "Ethereum", time: "8 min ago", flag: "🇦🇪" },
  { name: "Lisa C.", avatar: "LC", invested: 50000, gained: 68500, asset: "Miami Property", time: "12 min ago", flag: "🇨🇦" },
  { name: "Yuki T.", avatar: "YT", invested: 3200, gained: 7840, asset: "Solana", time: "15 min ago", flag: "🇯🇵" },
  { name: "Carlos D.", avatar: "CD", invested: 15000, gained: 31200, asset: "Apple Inc.", time: "18 min ago", flag: "🇧🇷" },
  { name: "Priya S.", avatar: "PS", invested: 7500, gained: 16800, asset: "Tesla", time: "22 min ago", flag: "🇮🇳" },
  { name: "Mike W.", avatar: "MW", invested: 25000, gained: 42500, asset: "Real Estate Fund", time: "25 min ago", flag: "🇦🇺" },
];

export function WinningTickets() {
  const [visibleIdx, setVisibleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIdx((prev) => (prev + 1) % winners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleWinners = [
    winners[visibleIdx % winners.length],
    winners[(visibleIdx + 1) % winners.length],
    winners[(visibleIdx + 2) % winners.length],
  ];

  return (
    <div className="glass p-6 rounded-xl border-profit/20">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
        </motion.div>
        <h3 className="font-semibold font-display text-sm">Live Investor Wins</h3>
        <motion.div
          className="w-2 h-2 rounded-full bg-profit"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs text-profit">LIVE</span>
      </div>

      <div className="space-y-3 min-h-[180px]">
        <AnimatePresence mode="popLayout">
          {visibleWinners.map((w, i) => (
            <motion.div
              key={`${w.name}-${visibleIdx}-${i}`}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-lg border border-profit/20 bg-gradient-to-r from-profit/5 to-transparent p-3"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-profit/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-profit/20 flex items-center justify-center text-xs font-bold text-profit">
                    {w.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{w.name}</span>
                      <span className="text-xs">{w.flag}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Invested ${w.invested.toLocaleString()} in {w.asset}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-profit font-bold text-sm">
                    <Sparkles className="w-3 h-3" />
                    +${(w.gained - w.invested).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{w.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
