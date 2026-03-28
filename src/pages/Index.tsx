import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Globe, Building2, PiggyBank, Shield, Users, ArrowRight,
  Lock, Zap, ChevronRight, LineChart
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AnimatedCoin } from "@/components/AnimatedCoin";

const categories = [
  { icon: TrendingUp, title: "Stocks & Shares", desc: "Invest in top-performing companies worldwide with real-time market data.", color: "from-blue-500/20 to-blue-600/5" },
  { icon: LineChart, title: "Cryptocurrency", desc: "Trade Bitcoin, Ethereum, and 200+ digital assets with live pricing.", color: "from-purple-500/20 to-purple-600/5" },
  { icon: Globe, title: "Forex Trading", desc: "Access global currency markets with competitive spreads and leverage.", color: "from-yellow-500/20 to-yellow-600/5" },
  { icon: Building2, title: "Real Estate", desc: "Own fractions of premium properties starting from $50,000.", color: "from-emerald-500/20 to-emerald-600/5" },
  { icon: PiggyBank, title: "Retirement Plans", desc: "Plan your future with smart retirement calculators and projections.", color: "from-pink-500/20 to-pink-600/5" },
];

const stats = [
  { value: "$12.4B+", label: "Assets Under Management" },
  { value: "500K+", label: "Active Investors" },
  { value: "120+", label: "Countries Served" },
  { value: "99.99%", label: "Uptime Guaranteed" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />

          {/* Floating coins */}
          <div className="absolute top-32 right-[10%] hidden lg:block">
            <AnimatedCoin symbol="₿" size={48} delay={0} color="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 90% 45%))" />
          </div>
          <div className="absolute top-52 left-[8%] hidden lg:block">
            <AnimatedCoin symbol="Ξ" size={36} delay={1} color="linear-gradient(135deg, hsl(230 60% 50%), hsl(270 60% 55%))" />
          </div>
          <div className="absolute bottom-20 right-[15%] hidden lg:block">
            <AnimatedCoin symbol="$" size={32} delay={2} color="linear-gradient(135deg, hsl(160 84% 39%), hsl(160 84% 50%))" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>Now with AI-Powered Portfolio Insights</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Invest Smarter.
              <br />
              <span className="text-gradient">Grow Without Limits.</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              One platform for stocks, crypto, forex, real estate, and retirement.
              Build wealth with institutional-grade tools designed for everyone.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/signup">
                <Button size="lg" className="gradient-primary border-0 text-foreground shadow-glow text-base px-8 py-6 rounded-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/markets">
                <Button variant="outline" size="lg" className="bg-secondary/30 border-glass-border text-foreground text-base px-8 py-6 rounded-xl hover:bg-secondary/50">
                  Explore Markets
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-8 border-y border-border">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-muted-foreground">
            {[
              { icon: Shield, label: "SEC Regulated" },
              { icon: Lock, label: "256-bit Encryption" },
              { icon: Users, label: "500K+ Investors" },
              { icon: Globe, label: "Global Access" },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <t.icon className="w-5 h-5 text-profit" />
                <span>{t.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Investment Categories */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                Every Asset Class. <span className="text-gradient">One Platform.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Diversify across the world's most profitable markets from a single dashboard.
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat.title}
                  variants={item}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group glass p-6 rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                    <cat.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold font-display mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-5xl mx-auto glass-strong rounded-2xl p-10 sm:p-14"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold font-display text-gradient mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
              Ready to Build Your <span className="text-gradient">Wealth?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 500,000+ investors already growing their portfolios with Aventus-Notch.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary border-0 text-foreground shadow-glow text-base px-10 py-6 rounded-xl">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-bold font-display">Aventus-Notch</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The all-in-one investment ecosystem for modern investors.
                </p>
              </div>
              {[
                { title: "Products", links: ["Stocks", "Crypto", "Forex", "Real Estate", "Retirement"] },
                { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
              © 2026 Aventus-Notch. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default Index;
