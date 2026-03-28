import { motion } from "framer-motion";

interface AnimatedCoinProps {
  symbol: string;
  size?: number;
  delay?: number;
  color?: string;
}

export function AnimatedCoin({ symbol, size = 40, delay = 0, color }: AnimatedCoinProps) {
  return (
    <motion.div
      className="rounded-full flex items-center justify-center font-bold text-xs border border-glass-border"
      style={{
        width: size,
        height: size,
        background: color || "linear-gradient(135deg, hsl(217 91% 60%), hsl(270 80% 60%))",
      }}
      animate={{
        y: [0, -6, 0],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <span className="text-foreground">{symbol}</span>
    </motion.div>
  );
}
