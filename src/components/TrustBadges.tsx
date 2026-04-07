import { motion } from "framer-motion";
import { Shield, Award, BadgeCheck, Landmark, Lock, Globe } from "lucide-react";

const badges = [
  { icon: Shield, label: "SEC Regulated", color: "text-profit" },
  { icon: Award, label: "Award Winning", color: "text-yellow-500" },
  { icon: BadgeCheck, label: "SOC 2 Certified", color: "text-primary" },
  { icon: Landmark, label: "FDIC Insured", color: "text-profit" },
  { icon: Lock, label: "Bank-Grade Security", color: "text-primary" },
  { icon: Globe, label: "120+ Countries", color: "text-profit" },
];

const partners = [
  { name: "Bloomberg", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bloomberg_logo.svg/200px-Bloomberg_logo.svg.png" },
  { name: "Reuters", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Reuters_Logo.svg/200px-Reuters_Logo.svg.png" },
  { name: "NASDAQ", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Nasdaq_Logo.svg/200px-Nasdaq_Logo.svg.png" },
  { name: "CoinGecko", logo: "https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924571ba9c97e75ccb72e69aa80de6e717d27.png" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png" },
  { name: "TradingView", logo: "https://www.google.com/s2/favicons?domain=tradingview.com&sz=64" },
];

export function TrustBadges() {
  return (
    <section className="py-12 sm:py-16 px-4 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Trusted & Verified</h3>
        </motion.div>

        {/* Trust Badges - responsive grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 sm:gap-3 text-center hover:border-primary/30 transition-all group cursor-default"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                <badge.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground leading-tight">{badge.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos - scrolling marquee */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#020617] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#020617] to-transparent z-10" />
          <motion.div
            animate={{ x: [0, -600] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap"
          >
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors shrink-0">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-5 sm:h-6 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-sm sm:text-lg font-bold font-display tracking-wider">{p.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
