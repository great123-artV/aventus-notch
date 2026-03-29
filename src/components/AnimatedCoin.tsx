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
      className="rounded-full flex items-center justify-center font-bold text-xs shadow-lg"
      style={{
        width: size,
        height: size,
        background: color || "linear-gradient(135deg, hsl(75 80% 50%), hsl(85 75% 45%))",
        perspective: "600px",
      }}
      animate={{
        y: [0, -8, 0],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <span className="text-background font-bold">{symbol}</span>
    </motion.div>
  );
}
