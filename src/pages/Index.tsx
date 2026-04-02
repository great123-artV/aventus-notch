import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Globe, Building2, PiggyBank, Shield, Users, ArrowRight,
  Lock, Zap, ChevronRight, LineChart, CheckCircle2
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AnimatedCoin } from "@/components/AnimatedCoin";
import { HeroBackground } from "@/components/HeroBackground";
import { Phone3D } from "@/components/Phone3D";
import { DashboardMockup } from "@/components/DashboardMockup";
import { Testimonials } from "@/components/Testimonials";
import { ComparisonTable } from "@/components/ComparisonTable";
import { useRef, useEffect, useState } from "react";

function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const categories = [
  { icon: TrendingUp, title: "Stocks & Shares", desc: "Access 5,000+ global equities with real-time data and zero-commission trading.", badge: "Popular" },
  { icon: LineChart, title: "Cryptocurrency", desc: "Trade 200+ digital assets including BTC, ETH, SOL with institutional-grade security.", badge: "24/7" },
  { icon: Globe, title: "Forex Trading", desc: "70+ currency pairs with tight spreads and up to 50x leverage for experienced traders.", badge: "Global" },
  { icon: Building2, title: "Real Estate", desc: "Fractional ownership of premium properties starting from $50,000 with projected 8-15% returns.", badge: "New" },
  { icon: PiggyBank, title: "Retirement Plans", desc: "AI-optimized retirement planning with tax-advantaged accounts and compound growth projections.", badge: "Smart" },
];

const stats = [
  { value: 12.4, suffix: "B+", prefix: "$", label: "Assets Under Management" },
  { value: 500, suffix: "K+", prefix: "", label: "Active Investors" },
  { value: 120, suffix: "+", prefix: "", label: "Countries Served" },
  { value: 99, suffix: ".99%", prefix: "", label: "Platform Uptime" },
];

const features = [
  "Commission-free trading on stocks & ETFs",
  "Bank-level 256-bit AES encryption",
  "SIPC protected up to $500,000",
  "Real-time market data & AI insights",
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Index = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <AnimatedPage>
      <div className="min-h-screen overflow-hidden">
        {/* Hero — Robinhood-style bold, dark, neon accent */}
         <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden">
          <HeroBackground />

          {/* Floating coins */}
          <div className="absolute top-[20%] right-[12%] hidden lg:block">
            <AnimatedCoin symbol="₿" size={52} delay={0} color="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 90% 40%))" />
          </div>
          <div className="absolute top-[60%] left-[8%] hidden lg:block">
            <AnimatedCoin symbol="Ξ" size={38} delay={1.5} color="linear-gradient(135deg, hsl(230 60% 55%), hsl(270 60% 50%))" />
          </div>
          <div className="absolute bottom-[25%] right-[20%] hidden lg:block">
            <AnimatedCoin symbol="$" size={32} delay={0.8} color="linear-gradient(135deg, hsl(152 82% 39%), hsl(152 82% 50%))" />
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left — Text content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/40 backdrop-blur-sm text-sm text-muted-foreground mb-8"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span>AI-Powered Portfolio Insights — Now Live</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-display leading-[0.95] mb-8 tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Invest Smarter.
                <br />
                <span className="text-gradient">Grow Without</span>
                <br />
                <span className="text-gradient">Limits.</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                One platform for stocks, crypto, forex, real estate, and retirement.
                Build wealth with institutional-grade tools designed for everyone.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-glow text-base px-10 py-7 rounded-full font-semibold">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/markets">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="lg" className="border-border bg-secondary/20 backdrop-blur-sm text-foreground text-base px-10 py-7 rounded-full hover:bg-secondary/40">
                      Explore Markets
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-10 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {features.map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
                    {f}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D Phone */}
            <div className="flex-shrink-0 flex items-center justify-center mt-8 lg:mt-0">
              <Phone3D />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </section>

        {/* Trust Bar — Clean, minimal like Revolut */}
        <section className="py-6 border-y border-border bg-secondary/20">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {[
              { icon: Shield, label: "SEC Regulated" },
              { icon: Lock, label: "256-bit Encryption" },
              { icon: Users, label: "500K+ Investors" },
              { icon: Globe, label: "120+ Countries" },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <t.icon className="w-4 h-4 text-profit" />
                <span>{t.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Investment Categories — Revolut-style cards with scroll reveal */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold font-display mb-5 tracking-tight">
                Every Asset Class.
                <br />
                <span className="text-gradient">One Platform.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Diversify across the world's most profitable markets from a single, powerful dashboard.
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat.title}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group relative glass p-7 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/60 flex items-center justify-center">
                        <cat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold font-display mb-2">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Dashboard Mockup Section */}
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
                Your Wealth,
                <br />
                <span className="text-gradient">At a Glance.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                A powerful dashboard that puts your entire portfolio in one beautiful view.
              </p>
            </motion.div>
            <DashboardMockup />
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-4">
          <motion.div
            className="max-w-5xl mx-auto glass-strong p-12 sm:p-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl sm:text-5xl font-bold font-display text-gradient mb-3">
                    <CountUp target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Comparison Table */}
        <ComparisonTable />

        {/* CTA — Bold, simple like Robinhood */}
        <section className="py-24 px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold font-display mb-6 tracking-tight">
              Start Building Your
              <br />
              <span className="text-gradient">Wealth Today</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 500,000+ investors already growing their portfolios. No minimums, no hidden fees.
            </p>
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-glow text-base px-12 py-7 rounded-full font-semibold">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-14 px-4 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary-foreground" />
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
                  <ul className="space-y-2.5">
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
              © 2026 Aventus-Notch. All rights reserved. Not investment advice.
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default Index;
