import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Wallet, BarChart3, TrendingUp, ShieldCheck, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const HowToInvest = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      desc: "Sign up in minutes with our secure onboarding process. No complex paperwork required.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Wallet,
      title: "Fund Your Wallet",
      desc: "Deposit funds using bank transfer, credit card, or crypto. Your assets are protected by institutional-grade security.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: BarChart3,
      title: "Choose Your Assets",
      desc: "Select from stocks, crypto, forex, oil & gas, or real estate. Use our AI tools to find the best opportunities.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Wealth",
      desc: "Monitor your portfolio in real-time, reinvest dividends, and watch your capital appreciate.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl font-bold font-display mb-6">
            Your Journey to <span className="text-gradient">Financial Freedom.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Starting your investment journey shouldn't be complicated. Follow these four simple steps to begin building your premium portfolio today.
          </p>
        </motion.div>

        <div className="space-y-8 mb-16">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 group"
            >
              <div className={`w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className={`w-10 h-10 ${step.color}`} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className={`text-sm font-bold uppercase tracking-widest ${step.color}`}>Step 0{idx + 1}</span>
                  <div className="h-px w-12 bg-white/10 hidden md:block" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.desc}
                </p>
              </div>
              <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-8 h-8 text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 rounded-[2rem] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
          <h2 className="text-3xl font-bold mb-6">Ready to take the first step?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join over 500,000 investors who trust Aventus-Notch with their financial future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary border-0 text-white shadow-glow px-10 py-7 rounded-2xl font-bold w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="bg-white/5 border-white/10 text-white px-10 py-7 rounded-2xl w-full sm:w-auto hover:bg-white/10">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Video Guide
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToInvest;
