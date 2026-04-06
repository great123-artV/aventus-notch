import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { useMemo } from "react";

const mockChartData = Array.from({ length: 20 }, (_, i) => ({
  value: 40000 + Math.random() * 20000 + (i * 1000)
}));

export function ThreeDPhone() {
  return (
    <div className="relative w-[280px] h-[580px] perspective-1000 group">
      <motion.div
        animate={{
          rotateY: [-10, 10, -10],
          rotateX: [5, -5, 5],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Phone Body */}
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#333] rounded-b-2xl z-20" />

          {/* Screen Content */}
          <div className="absolute inset-0 bg-[#020617] flex flex-col pt-12 p-4">
            <div className="mb-6">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Live Market</p>
              <h4 className="text-xl font-bold font-display">Bitcoin</h4>
              <p className="text-2xl font-bold text-profit">$64,240.50</p>
            </div>

            <div className="flex-1 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="phoneChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#phoneChart)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="h-10 rounded-xl bg-profit/20 border border-profit/30 flex items-center justify-center text-[10px] font-bold text-profit">BUY</div>
              <div className="h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">SELL</div>
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
