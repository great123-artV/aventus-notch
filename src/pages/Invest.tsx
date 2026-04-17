import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { InvestmentPlans } from "@/components/InvestmentPlans";
import { Building2, PiggyBank, ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const Invest = () => {
  const { t } = useLanguage();

  const categories = [
    {
      title: "Real Estate",
      desc: "Fractional ownership in premium properties with high rental yields.",
      icon: Building2,
      path: "/real-estate",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Retirement Plans",
      desc: "Secure your financial future with our long-term compound growth strategies.",
      icon: PiggyBank,
      path: "/retirement",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/50"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 theme-markets relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold font-display mb-6 tracking-tighter"
          >
            Investment <span className="text-gradient">Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the investment strategy that fits your goals, from high-yield quick plans to stable long-term growth.
          </motion.p>
        </div>

        {/* Quick Investment Plans Section */}
        <div className="mb-20">
          <InvestmentPlans />
        </div>

        {/* Other Categories */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Specialized Portfolios</h2>
            <p className="text-muted-foreground">Diversify your assets with our specialized investment vehicles.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Link to={cat.path}>
                  <div className={`group glass-card p-8 rounded-[32px] border border-white/5 transition-all duration-500 ${cat.border} relative overflow-hidden h-full flex flex-col`}>
                    <div className="flex items-center gap-5 mb-6">
                      <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-500 shadow-glow`}>
                        <cat.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold font-display">{cat.title}</h3>
                        <p className="text-sm text-muted-foreground">Diversified Growth</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-8 flex-grow">
                      {cat.desc}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                      Explore {cat.title} <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust & Stats section for this page */}
        <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center glass p-6 rounded-2xl">
            <Shield className="w-8 h-8 text-profit mb-3" />
            <h4 className="font-bold mb-1">Secure Capital</h4>
            <p className="text-xs text-muted-foreground">Institutional-grade security for all assets</p>
          </div>
          <div className="flex flex-col items-center text-center glass p-6 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold mb-1">Smart Yields</h4>
            <p className="text-xs text-muted-foreground">AI-optimized returns on every plan</p>
          </div>
          <div className="flex flex-col items-center text-center glass p-6 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-blue-500 mb-3" />
            <h4 className="font-bold mb-1">Live Tracking</h4>
            <p className="text-xs text-muted-foreground">Real-time performance monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invest;
