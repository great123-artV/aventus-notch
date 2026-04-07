import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Bot, ChevronRight, PieChart as PieIcon, Activity, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { portfolioData, profitLossData } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { TradingViewChart } from "@/components/premium/TradingViewWidget";
import { SocialProofSlideshow } from "@/components/premium/SocialProofSlideshow";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { DepositModal } from "@/components/wallet/DepositModal";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";
import { WalletConnectModal } from "@/components/wallet/WalletConnectModal";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { balance, user } = useAuth();
  const { totalProfit, profitPercent, distribution } = portfolioData;
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  const fetchInvestments = async () => {
    const { data } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setInvestments(data);
  };

  return (
    <div className="pt-24 pb-10 px-4 max-w-7xl mx-auto space-y-8 selection:bg-primary/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">Welcome back, Investor</h1>
          <p className="text-muted-foreground mt-1 text-lg">Your portfolio is performing <span className="text-profit font-semibold">well today.</span></p>
        </div>
        <div className="hidden md:block w-72">
          <SocialProofSlideshow compact />
        </div>
      </div>

      {/* Balance + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-32 h-32" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Portfolio Value</p>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl sm:text-6xl font-bold font-display">${balance.toLocaleString()}</span>
            <span className={`flex items-center gap-1 text-lg font-bold ${totalProfit >= 0 ? "text-profit" : "text-loss"}`}>
              {totalProfit >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              {profitPercent}%
            </span>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            <Button onClick={() => setIsDepositOpen(true)} size="lg" className="gradient-primary border-0 text-white shadow-glow px-8 rounded-2xl font-bold neon-glow-primary transition-all hover:scale-105 active:scale-95">
              <Wallet className="w-5 h-5 mr-2" /> Deposit
            </Button>
            <Button onClick={() => setIsWithdrawOpen(true)} size="lg" variant="outline" className="bg-white/5 border-white/10 backdrop-blur-md px-8 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95">
              <ArrowUpRight className="w-5 h-5 mr-2" /> Withdraw
            </Button>
            <Link to="/markets">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/10 backdrop-blur-md px-8 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95">
                <TrendingUp className="w-5 h-5 mr-2" /> Invest Now
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-3xl border-primary/20 relative flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow neon-glow-primary">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl font-display">AI Insights</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
              "Your portfolio is heavily weighted in stocks. Consider diversifying into crypto or real estate for better risk-adjusted returns."
            </p>
          </div>
          <Button variant="ghost" size="lg" className="text-primary p-0 h-auto font-bold hover:bg-transparent hover:text-primary/80 group text-lg">
            Optimization Strategy <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold font-display text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Live Market Analysis
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">BTC/USDT</span>
              <span className="px-3 py-1 bg-profit/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-profit">Live</span>
            </div>
          </div>
          <TradingViewChart />
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-3xl"
          >
            <h3 className="font-bold font-display mb-4 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-primary" /> Asset Allocation
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex-1 h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {distribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 pl-4">
                {distribution.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-3xl bg-gradient-to-br from-card/40 to-primary/5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" /> Profit History
              </h3>
              <span className="text-xs font-bold text-profit">+12.4% THIS MONTH</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={profitLossData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--profit))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--profit))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="hsl(var(--profit))" strokeWidth={3} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* Recent Investments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass p-8 rounded-3xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold font-display">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {investments.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No recent activity found. Start investing to see your portfolio here.</p>
          ) : (
            investments.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{inv.asset_name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono">${Number(inv.amount_invested).toLocaleString()}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-profit">{inv.asset_type}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <DepositModal open={isDepositOpen} onOpenChange={setIsDepositOpen} />
      <WithdrawModal open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen} />
    </div>
  );
};

export default Dashboard;
