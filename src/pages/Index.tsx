import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Globe, Building2, PiggyBank, Shield, Users, ArrowRight,
  Lock, Zap, ChevronRight, LineChart, Star, ArrowUpRight, Coins, Wallet, Cpu
} from "lucide-react";
import { SocialProofSlideshow } from "@/components/premium/SocialProofSlideshow";
import { InvestorTicker } from "@/components/premium/InvestorTicker";
import { MarketTicker } from "@/components/premium/TradingViewWidget";
import { TrustBadges } from "@/components/TrustBadges";
import { ThreeDPhone } from "@/components/premium/ThreeDPhone";
import { InvestmentPlans } from "@/components/InvestmentPlans";
import { motion } from "framer-motion";
import { useSiteConfigs } from "@/hooks/use-site-config";
import { useLanguage } from "@/contexts/LanguageContext";

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

const Index = () => {
  const { data: configs } = useSiteConfigs();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-primary/30 overflow-x-hidden theme-home relative">
      <InvestorTicker />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#020617]">
          <video
            key={configs?.homepage_video_url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain opacity-70"
            style={{ filter: 'brightness(0.7) contrast(1.2) saturate(1.1)' }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset.fallback !== 'true') {
                target.dataset.fallback = 'true';
                target.src = 'https://cdn.pixabay.com/video/2021/04/03/69579-532128942_large.mp4';
              }
            }}
          >
            <source src={configs?.homepage_video_url || "https://cdn.pixabay.com/video/2024/02/14/200750-913069622_large.mp4"} type="video/mp4" />
            <source src="https://cdn.pixabay.com/video/2021/04/03/69579-532128942_large.mp4" type="video/mp4" />
          </video>
          {/* Animated BTC coin overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [0.8, 1, 0.8],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #f7931a 0%, transparent 70%)',
                boxShadow: '0 0 120px 40px rgba(247, 147, 26, 0.15)',
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        </div>

        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        {/* Floating Crypto Icons Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 opacity-20"
          >
            <Coins className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 left-20 opacity-15"
          >
            <Wallet className="w-16 h-16 text-primary" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 20, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/3 right-10 opacity-20"
          >
            <Cpu className="w-14 h-14 text-primary" />
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 pt-10">
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary font-bold mb-8 border-primary/20 shadow-glow cursor-pointer"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-medium">{t("hero.aiInsights") || "Now with AI-Powered Portfolio Insights"}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-8xl font-extrabold font-display leading-[1.05] mb-8 tracking-tighter text-white drop-shadow-2xl selection:bg-primary/30"
              >
                {configs?.hero_title ? (
                  configs.hero_title.split('.').map((part, i, arr) => (
                    <span key={i}>
                      {part}{i < arr.length - 1 ? '.' : ''}
                      {i === 0 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    {t("hero.title").includes('.') ? (
                      t("hero.title").split('.').map((part, i, arr) => (
                        <span key={i}>
                          {i === 1 ? <span className="text-gradient">{part}</span> : part}
                          {i < arr.length - 1 ? '.' : ''}
                          {i === 0 && <br />}
                        </span>
                      ))
                    ) : (
                      <>
                        Invest Smarter.
                        <br />
                        <span className="text-gradient">Grow Without Limits.</span>
                      </>
                    )}
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl mb-12 leading-relaxed drop-shadow-lg"
              >
                {configs?.hero_subtitle || t("hero.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gradient-primary border-0 text-white shadow-glow text-lg px-10 py-7 rounded-2xl font-extrabold neon-glow-primary w-full sm:w-auto">
                      {t("hero.getStarted")}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/markets">
                  <Button variant="outline" size="lg" className="bg-white/5 border-white/10 backdrop-blur-md text-foreground text-lg px-10 py-7 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    {t("hero.exploreMarkets")}
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center mt-12 lg:mt-0"
            >
              <ThreeDPhone />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <MarketTicker />
          </motion.div>
        </div>
      </section>

      {/* Social Proof Slideshow Section */}
      <section className="py-12 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold tracking-wider uppercase text-xs text-muted-foreground">Recent Success Stories</span>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <SocialProofSlideshow />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-5 h-5 text-profit" />
            <span>SEC Regulated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-5 h-5 text-profit" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-5 h-5 text-profit" />
            <span>500K+ Investors</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-5 h-5 text-profit" />
            <span>Global Access</span>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Investment Plans */}
      <div id="investment-plans" className="scroll-mt-24">
        <InvestmentPlans />
      </div>

      {/* Investment Categories */}
      <section className="py-32 px-4 relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-[150px]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-extrabold font-display mb-6 tracking-tighter">
              Every Asset Class. <br /> <span className="text-gradient">One Platform.</span>
            </h2>
            <p className="text-foreground/70 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
              Diversify across the world's most profitable markets from a single, high-performance dashboard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group glass-card p-8 rounded-3xl hover:border-primary/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-6 h-6 text-primary" />
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-glow`}>
                  <cat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">{cat.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto glass-strong rounded-2xl p-10 sm:p-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-display text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-6xl font-bold font-display mb-8">
            Ready to Build Your <span className="text-gradient">Wealth?</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto">
            Join 500,000+ investors already growing their portfolios with institutional-grade tools and real-time market insights.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary border-0 text-white shadow-glow text-xl px-12 py-8 rounded-2xl font-bold neon-glow-primary">
              Create Your Free Account
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-5 h-5 text-white" />
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
  );
};

export default Index;
