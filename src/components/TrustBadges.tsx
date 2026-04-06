import { motion } from "framer-motion";
import { Shield, Award, BadgeCheck, Landmark, Lock, Globe } from "lucide-react";

const badges = [
  { icon: Shield, label: "SEC Regulated", color: "text-profit" },
  { icon: Award, label: "Award Winning Platform", color: "text-yellow-500" },
  { icon: BadgeCheck, label: "SOC 2 Certified", color: "text-primary" },
  { icon: Landmark, label: "FDIC Insured", color: "text-profit" },
  { icon: Lock, label: "Bank-Grade Security", color: "text-primary" },
  { icon: Globe, label: "Licensed in 120+ Countries", color: "text-profit" },
];

const partners = [
  "Bloomberg", "Reuters", "NASDAQ", "NYSE", "CoinGecko", "Stripe", "Plaid", "TradingView"
];

export function TrustBadges() {
  return (
    <section className="py-16 px-4 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Trusted & Verified</h3>
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass p-4 rounded-2xl flex flex-col items-center gap-3 text-center hover:border-primary/30 transition-all group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                <badge.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground leading-tight">{badge.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Scrolling Partner Logos */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#020617] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#020617] to-transparent z-10" />
          <motion.div
            animate={{ x: [0, -800] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...partners, ...partners, ...partners].map((name, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                <span className="text-lg font-bold font-display tracking-wider">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
