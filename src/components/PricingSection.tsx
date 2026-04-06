import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "Forever",
    icon: Rocket,
    highlight: false,
    features: [
      "Commission-free stock trading",
      "Basic crypto trading (20 coins)",
      "Real-time market data",
      "Mobile app access",
      "Standard customer support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    subtitle: "/month",
    icon: Sparkles,
    highlight: true,
    features: [
      "Everything in Starter",
      "200+ cryptocurrencies",
      "Forex trading access",
      "AI portfolio insights",
      "Real-time signals & alerts",
      "Priority support",
      "Advanced charting tools",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Elite",
    price: "$29.99",
    subtitle: "/month",
    icon: Crown,
    highlight: false,
    features: [
      "Everything in Pro",
      "Fractional real estate",
      "Retirement planning suite",
      "Copy trading",
      "Dedicated account manager",
      "API access",
      "Tax-loss harvesting",
      "Institutional-grade analytics",
    ],
    cta: "Go Elite",
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-display mb-5 tracking-tight">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when you're ready to unlock the full power of Aventus-Notch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative glass p-8 flex flex-col ${
                tier.highlight
                  ? "ring-2 ring-primary/40 shadow-neon"
                  : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest gradient-primary text-primary-foreground px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tier.highlight ? "gradient-primary" : "bg-secondary/60"
                }`}>
                  <tier.icon className={`w-5 h-5 ${tier.highlight ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h3 className="text-xl font-bold font-display">{tier.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold font-display">{tier.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{tier.subtitle}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-profit mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className={`w-full rounded-full py-6 font-semibold ${
                    tier.highlight
                      ? "gradient-primary border-0 text-primary-foreground shadow-glow"
                      : "bg-secondary/40 border border-border text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}