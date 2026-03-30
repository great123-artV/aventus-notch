import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, BarChart3, PieChart, Wallet } from "lucide-react";

function DashboardScreen() {
  return (
    <div className="absolute inset-0 rounded-[12px] overflow-hidden bg-[#0c1120] flex flex-col text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-[10px] font-semibold">Dashboard</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        </div>
      </div>

      {/* Portfolio cards row */}
      <div className="flex gap-2 px-3 pt-3">
        {[
          { label: "Total Balance", value: "$127,843", icon: Wallet, change: "+12.4%" },
          { label: "Today's P&L", value: "+$2,341", icon: TrendingUp, change: "+1.8%" },
          { label: "Assets", value: "24", icon: PieChart, change: "" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="flex-1 bg-white/5 rounded-lg p-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
          >
            <card.icon className="w-3 h-3 text-emerald-400 mb-1" />
            <div className="text-[10px] text-white/50">{card.label}</div>
            <div className="text-[13px] font-bold">{card.value}</div>
            {card.change && (
              <div className="text-[8px] text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-2 h-2" />{card.change}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart area */}
      <div className="px-3 pt-3 flex-1">
        <div className="text-[9px] text-white/40 mb-1">Portfolio Performance</div>
        <svg viewBox="0 0 400 100" className="w-full h-[60px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,80 C30,75 60,60 100,55 C140,50 170,65 200,45 C230,25 260,35 300,20 C340,10 370,15 400,5"
            fill="none" stroke="#10B981" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
          />
          <path
            d="M0,80 C30,75 60,60 100,55 C140,50 170,65 200,45 C230,25 260,35 300,20 C340,10 370,15 400,5 L400,100 L0,100 Z"
            fill="url(#dash-fill)" opacity="0.5"
          />
        </svg>
      </div>

      {/* Holdings list */}
      <div className="px-3 pb-3">
        <div className="text-[9px] text-white/40 mb-1.5">Top Holdings</div>
        {[
          { name: "BTC", pct: "34%", val: "$43,466", up: true },
          { name: "ETH", pct: "22%", val: "$28,125", up: true },
          { name: "AAPL", pct: "18%", val: "$23,011", up: false },
        ].map((h, i) => (
          <motion.div
            key={h.name}
            className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + i * 0.15 }}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold ${h.up ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {h.name[0]}
              </div>
              <div>
                <div className="text-[10px] font-medium">{h.name}</div>
                <div className="text-[8px] text-white/30">{h.pct} of portfolio</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold">{h.val}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: "min(100%, 600px)", perspective: "1200px" }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative"
        animate={{ rotateX: [2, 0, 2], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Tablet frame */}
        <div
          className="relative rounded-[20px] p-[8px] aspect-[4/3]"
          style={{
            background: "linear-gradient(145deg, #2a2a2e, #1a1a1e)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 60px 5px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="w-full h-full rounded-[14px] overflow-hidden bg-black relative">
            <DashboardScreen />
            {/* Reflection sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)" }}
              animate={{ x: [-300, 600] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Glow beneath */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[30px] rounded-full blur-2xl"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.12), transparent)" }} />
      </motion.div>
    </motion.div>
  );
}
