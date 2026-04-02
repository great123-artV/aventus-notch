import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type FeatureValue = true | false | string;

interface Feature {
  name: string;
  aventus: FeatureValue;
  robinhood: FeatureValue;
  etoro: FeatureValue;
  coinbase: FeatureValue;
}

const features: Feature[] = [
  { name: "Commission-Free Stocks", aventus: true, robinhood: true, etoro: false, coinbase: false },
  { name: "Cryptocurrency Trading", aventus: "200+ coins", robinhood: "20+ coins", etoro: "80+ coins", coinbase: "250+ coins" },
  { name: "Forex Trading", aventus: true, robinhood: false, etoro: true, coinbase: false },
  { name: "Fractional Real Estate", aventus: true, robinhood: false, etoro: false, coinbase: false },
  { name: "Retirement Planning", aventus: true, robinhood: true, etoro: false, coinbase: false },
  { name: "AI Portfolio Insights", aventus: true, robinhood: false, etoro: false, coinbase: false },
  { name: "Copy Trading", aventus: true, robinhood: false, etoro: true, coinbase: false },
  { name: "Real-Time Signals", aventus: true, robinhood: false, etoro: true, coinbase: false },
  { name: "Countries Supported", aventus: "120+", robinhood: "1 (US)", etoro: "140+", coinbase: "100+" },
  { name: "Mobile App Rating", aventus: "4.9★", robinhood: "4.2★", etoro: "4.0★", coinbase: "4.5★" },
];

const scores = [
  { name: "Aventus-Notch", score: 98, highlight: true },
  { name: "Robinhood", score: 52, highlight: false },
  { name: "eToro", score: 61, highlight: false },
  { name: "Coinbase", score: 48, highlight: false },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ProgressBar({ score, highlight, delay }: { score: number; highlight: boolean; delay: number }) {
  return (
    <motion.div
      className="h-2 rounded-full bg-secondary/40 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <motion.div
        className={`h-full rounded-full ${highlight ? "gradient-primary" : "bg-muted-foreground/30"}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

function CellValue({ value }: { value: FeatureValue }) {
  if (value === true) return <Check className="w-4 h-4 text-profit mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-loss/50 mx-auto" />;
  return <span className="text-xs sm:text-sm text-foreground/80">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-display mb-5 tracking-tight">
            Why Choose <span className="text-gradient">Aventus-Notch?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See how we stack up against the competition.
          </p>
        </motion.div>

        {/* Score bars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {scores.map((s, i) => (
            <motion.div
              key={s.name}
              className={`glass p-5 ${s.highlight ? "ring-1 ring-primary/30" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold ${s.highlight ? "text-gradient" : "text-muted-foreground"}`}>
                  {s.name}
                </span>
                <span className={`text-lg font-bold ${s.highlight ? "text-primary" : "text-muted-foreground"}`}>
                  <AnimatedCounter target={s.score} suffix="%" />
                </span>
              </div>
              <ProgressBar score={s.score} highlight={s.highlight} delay={i * 0.1} />
            </motion.div>
          ))}
        </div>

        {/* Feature table */}
        <motion.div
          className="glass overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 sm:p-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Feature</th>
                  <th className="p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm font-bold text-gradient">Aventus-Notch</div>
                  </th>
                  <th className="p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">Robinhood</div>
                  </th>
                  <th className="p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">eToro</div>
                  </th>
                  <th className="p-3 sm:p-4 text-center">
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">Coinbase</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <motion.tr
                    key={f.name}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-foreground/90 whitespace-nowrap">{f.name}</td>
                    <td className="p-3 sm:p-4 text-center bg-primary/5"><CellValue value={f.aventus} /></td>
                    <td className="p-3 sm:p-4 text-center"><CellValue value={f.robinhood} /></td>
                    <td className="p-3 sm:p-4 text-center"><CellValue value={f.etoro} /></td>
                    <td className="p-3 sm:p-4 text-center"><CellValue value={f.coinbase} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
