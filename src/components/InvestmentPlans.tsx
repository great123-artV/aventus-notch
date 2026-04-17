import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, Clock, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  { invest: 100, earn: 2050, hot: false },
  { invest: 200, earn: 3500, hot: false },
  { invest: 300, earn: 5500, hot: true },
  { invest: 500, earn: 7500, hot: true },
  { invest: 1000, earn: 12500, hot: false },
];

export function InvestmentPlans() {
  const { user, balance } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (planAmount: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (balance >= planAmount) {
      navigate(`/markets?plan=${planAmount}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Limited Time Offer</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            💰 Investment <span className="text-gradient">Plans</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold">Duration: 48 Hours Only</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.invest}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handlePlanClick(plan.invest)}
              className={`relative glass-card p-6 rounded-2xl text-center hover:border-primary/50 transition-all group cursor-pointer ${
                plan.hot ? "border-yellow-500/30 ring-1 ring-yellow-500/20" : ""
              }`}
            >
              {plan.hot && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  <Flame className="w-3 h-3" /> Hot
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-2 font-medium">Invest</p>
              <p className="text-3xl font-bold font-display mb-3">${plan.invest.toLocaleString()}</p>
              <div className="w-full h-px bg-white/10 my-3" />
              <p className="text-xs text-muted-foreground mb-1">Earn</p>
              <p className="text-2xl font-bold text-profit font-display">${plan.earn.toLocaleString()}</p>
              <p className="text-[10px] text-yellow-500/80 mt-2 font-bold">⏳ 48 HRS</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/signup">
            <Button size="lg" className="gradient-primary border-0 text-[#050505] shadow-glow rounded-2xl font-bold px-10 py-6 text-lg">
              Start Investing Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
