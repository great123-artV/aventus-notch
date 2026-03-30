import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";

// Animated line chart on the phone screen
function MiniChart({ color, delay = 0 }: { color: string; delay?: number }) {
  const points = useMemo(() => {
    const pts: number[] = [];
    let y = 60;
    for (let i = 0; i <= 20; i++) {
      y += (Math.random() - 0.35) * 12;
      y = Math.max(15, Math.min(85, y));
      pts.push(y);
    }
    // Ensure upward trend
    for (let i = 15; i <= 20; i++) {
      pts[i] = Math.max(10, pts[i] - (i - 14) * 4);
    }
    return pts.map((y, i) => `${i * 15},${y}`).join(" ");
  }, []);

  return (
    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`chart-fill-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: delay + 0.8, ease: "easeInOut" }}
      />
      <motion.polygon
        points={`0,100 ${points} 300,100`}
        fill={`url(#chart-fill-${delay})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay + 2 }}
      />
    </svg>
  );
}

// Counting number animation
function AnimCounter({ from, to, prefix = "", suffix = "", duration = 2.5, delay = 0 }: {
  from: number; to: number; prefix?: string; suffix?: string; duration?: number; delay?: number;
}) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [from, to, duration, delay]);

  return <span>{prefix}{val.toLocaleString(undefined, { maximumFractionDigits: 2 })}{suffix}</span>;
}

// Crypto signal row
function SignalRow({ symbol, name, price, change, positive, delay }: {
  symbol: string; name: string; price: string; change: string; positive: boolean; delay: number;
}) {
  return (
    <motion.div
      className="flex items-center justify-between py-2 px-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: positive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: positive ? "#10B981" : "#EF4444" }}>
          {symbol}
        </div>
        <span className="text-[11px] font-medium text-white/90">{name}</span>
      </div>
      <div className="text-right">
        <div className="text-[11px] font-semibold text-white">{price}</div>
        <div className={`text-[9px] flex items-center gap-0.5 ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {change}
        </div>
      </div>
    </motion.div>
  );
}

// Phone screen content
function PhoneScreen() {
  return (
    <div className="absolute inset-0 rounded-[28px] overflow-hidden bg-[#0c1120] flex flex-col">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[9px] text-white/50 font-medium">9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-1.5 rounded-sm bg-white/30" />
          <div className="w-3 h-1.5 rounded-sm bg-white/30" />
          <div className="w-4 h-1.5 rounded-sm bg-emerald-400/80" />
        </div>
      </div>

      {/* Portfolio value */}
      <div className="px-4 pt-2 pb-1">
        <motion.div
          className="text-[9px] text-white/50 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Portfolio Value
        </motion.div>
        <motion.div
          className="text-[22px] font-bold text-white tracking-tight leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <AnimCounter from={12450} to={48729} prefix="$" delay={0.8} duration={3} />
        </motion.div>
        <motion.div
          className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <ArrowUpRight className="w-3 h-3" />
          <AnimCounter from={0} to={291.4} prefix="+" suffix="%" delay={1.3} duration={2.5} />
          <span className="text-white/30 ml-1 font-normal">all time</span>
        </motion.div>
      </div>

      {/* Main chart */}
      <div className="px-3 h-[90px] relative">
        <MiniChart color="#10B981" delay={0} />
        {/* Glowing dot at end */}
        <motion.div
          className="absolute right-3 top-[18%] w-2 h-2 rounded-full bg-emerald-400"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1], scale: 1 }}
          transition={{ delay: 3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
          style={{ boxShadow: "0 0 12px 4px rgba(16,185,129,0.5)" }}
        />
      </div>

      {/* Time tabs */}
      <motion.div
        className="flex gap-1 px-4 py-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((t, i) => (
          <span
            key={t}
            className={`text-[8px] px-2 py-0.5 rounded-full font-medium ${
              t === "ALL" ? "bg-emerald-500/20 text-emerald-400" : "text-white/30"
            }`}
          >
            {t}
          </span>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/5" />

      {/* Signals header */}
      <motion.div
        className="flex items-center justify-between px-4 pt-2 pb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-[10px] font-semibold text-white/70">Live Signals</span>
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] text-emerald-400">LIVE</span>
        </motion.div>
      </motion.div>

      {/* Crypto signals */}
      <div className="flex-1 overflow-hidden px-1">
        <SignalRow symbol="₿" name="Bitcoin" price="$67,842" change="+5.2%" positive delay={2} />
        <SignalRow symbol="Ξ" name="Ethereum" price="$3,456" change="+3.8%" positive delay={2.2} />
        <SignalRow symbol="◎" name="Solana" price="$178.50" change="+12.4%" positive delay={2.4} />
        <SignalRow symbol="₮" name="XRP" price="$0.584" change="-1.2%" positive={false} delay={2.6} />
      </div>

      {/* Bottom bar */}
      <motion.div
        className="px-3 pb-3 pt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="bg-emerald-500/90 rounded-xl py-2 text-center">
          <span className="text-[11px] font-bold text-black">Invest Now →</span>
        </div>
      </motion.div>
    </div>
  );
}

export function Phone3D() {
  return (
    <motion.div
      className="relative w-[240px] h-[480px] sm:w-[270px] sm:h-[540px] lg:w-[300px] lg:h-[600px]"
      initial={{ opacity: 0, y: 60, rotateY: -15, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateY: -8, rotateX: 3 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        className="w-full h-full"
        animate={{ y: [0, -12, 0], rotateY: [-8, -4, -8], rotateX: [3, 5, 3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Phone frame */}
        <div
          className="relative w-full h-full rounded-[36px] p-[6px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2e, #1a1a1e, #0a0a0e)",
            boxShadow: `
              0 50px 100px -20px rgba(0,0,0,0.8),
              0 30px 60px -10px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.1),
              0 0 80px 10px rgba(16,185,129,0.08),
              0 0 120px 30px rgba(16,185,129,0.04)
            `,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Side highlight */}
          <div className="absolute -left-[2px] top-[20%] w-[3px] h-[15%] rounded-full bg-white/10" />
          <div className="absolute -right-[2px] top-[25%] w-[3px] h-[8%] rounded-full bg-white/10" />
          <div className="absolute -right-[2px] top-[35%] w-[3px] h-[8%] rounded-full bg-white/10" />

          {/* Screen bezel */}
          <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-b-2xl z-20" />
            
            {/* Screen content */}
            <PhoneScreen />

            {/* Screen reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)",
              }}
              animate={{ x: [-200, 400] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Glow beneath phone */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-[40px] rounded-full blur-2xl"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.15), transparent)" }}
        />
      </motion.div>
    </motion.div>
  );
}
