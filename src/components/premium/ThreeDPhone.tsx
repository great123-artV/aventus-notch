import { motion, useAnimation } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { useState, useMemo, useEffect } from "react";
import { CandleChart } from "./CandleChart";

const mockChartData = Array.from({ length: 20 }, (_, i) => ({
  value: 40000 + Math.random() * 20000 + (i * 1000)
}));

export function ThreeDPhone() {
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();

  const handleFlip = async () => {
    setIsFlipped(!isFlipped);
    await controls.start({
      rotateY: isFlipped ? 0 : 180,
      transition: { duration: 0.8, ease: "easeInOut" }
    });
  };

  return (
    <div
      className="relative w-[280px] h-[580px] perspective-1000 cursor-pointer group"
      onClick={handleFlip}
    >
      <motion.div
        animate={controls}
        initial={{ rotateY: 0 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front of Phone */}
        <div className="absolute inset-0 backface-hidden">
          <div className="absolute inset-0 bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#333] rounded-b-2xl z-20" />

            {/* Screen Content */}
            <div className="absolute inset-0 bg-[#020617] flex flex-col pt-12 p-4">
              <div className="mb-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Live Market</p>
                <h4 className="text-xl font-bold font-display text-white">Bitcoin</h4>
              </div>

              <div className="flex-1 -mx-2 relative overflow-hidden">
                <CandleChart />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl bg-profit/20 border border-profit/30 flex items-center justify-center text-[10px] font-bold text-profit">BUY</div>
                <div className="h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">SELL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Phone */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
          <div className="absolute inset-0 bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden flex flex-col items-center pt-20">
            {/* Premium Camera Module */}
            <div className="w-32 h-32 bg-[#222] rounded-[2rem] border-4 border-[#333] p-4 grid grid-cols-2 gap-2 shadow-inner">
              <div className="bg-black rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#111] border-2 border-primary/30" />
              </div>
              <div className="bg-black rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#111] border-2 border-primary/30" />
              </div>
              <div className="bg-black rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#111] border-2 border-primary/30" />
              </div>
              <div className="bg-white/5 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center opacity-50">
                <div className="w-6 h-6 border-2 border-white/50 rounded-lg" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">Aventus Notch</span>
            </div>

            {/* Transparent "Screen" effect on back */}
            <div className="absolute inset-x-4 bottom-4 top-64 bg-primary/5 rounded-[2rem] border border-white/5 backdrop-blur-sm overflow-hidden flex flex-col pt-8 p-4">
              <div className="mb-2 px-2">
                <p className="text-[8px] text-primary/60 uppercase tracking-widest font-bold">Secondary Feed</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                  <span className="text-[10px] font-bold text-white/40">BTC/USDT LIVE</span>
                </div>
              </div>
              <div className="flex-1 opacity-40 scale-90 origin-top">
                <CandleChart />
              </div>
              <div className="mt-2 text-center">
                <p className="text-[8px] text-white/20 font-mono italic">ENCRYPTED DATA STREAM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Reflection */}
        <div className="absolute -right-2 top-20 bottom-20 w-1 bg-white/10 blur-[1px] rounded-full" />
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/50 blur-xl rounded-full"
      />
    </div>
  );
}
