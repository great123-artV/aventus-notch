import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Send, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { portfolioData, profitLossData, mockTransactions } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TickerBanner } from "@/components/TickerBanner";
import { WinningTickets } from "@/components/WinningTickets";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AnimatedCoin } from "@/components/AnimatedCoin";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

const Dashboard = () => {
  const { totalBalance, totalProfit, profitPercent, distribution } = portfolioData;

  return (
    <AnimatedPage>
      <div className="pt-16">
        <TickerBanner />
        <div className="pb-10 px-4 max-w-7xl mx-auto pt-6">
          <motion.div {...fadeUp(0)} className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Welcome back, Investor</h1>
              <p className="text-muted-foreground mt-1 text-sm">Here's your portfolio overview</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <AnimatedCoin symbol="₿" delay={0} color="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 90% 45%))" />
              <AnimatedCoin symbol="Ξ" delay={0.5} color="linear-gradient(135deg, hsl(230 60% 50%), hsl(270 60% 55%))" />
              <AnimatedCoin symbol="$" delay={1} color="linear-gradient(135deg, hsl(152 82% 39%), hsl(152 82% 50%))" />
            </div>
          </motion.div>

          {/* Balance + Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-4 mb-5">
            <motion.div {...fadeUp(0.1)} className="lg:col-span-2 glass p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total Portfolio Value</p>
              <div className="flex items-end gap-3 mb-5">
                <span className="text-4xl sm:text-5xl font-bold font-display tracking-tight">${totalBalance.toLocaleString()}</span>
                <span className={`flex items-center gap-1 text-sm font-semibold pb-1 ${totalProfit >= 0 ? "text-profit" : "text-loss"}`}>
                  {totalProfit >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  ${Math.abs(totalProfit).toLocaleString()} ({profitPercent}%)
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/markets">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="sm" className="gradient-primary border-0 text-primary-foreground shadow-glow rounded-full px-5 font-semibold">
                      <TrendingUp className="w-4 h-4 mr-1" /> Invest
                    </Button>
                  </motion.div>
                </Link>
                <Button size="sm" variant="outline" className="bg-secondary/30 border-border rounded-full px-5">
                  <Wallet className="w-4 h-4 mr-1" /> Withdraw
                </Button>
                <Button size="sm" variant="outline" className="bg-secondary/30 border-border rounded-full px-5">
                  <Send className="w-4 h-4 mr-1" /> Transfer
                </Button>
              </div>
            </motion.div>

            {/* AI Assistant */}
            <motion.div {...fadeUp(0.15)} className="glass p-6 border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"
                  animate={{ boxShadow: ["0 0 0px hsl(75 80% 50% / 0)", "0 0 20px hsl(75 80% 50% / 0.3)", "0 0 0px hsl(75 80% 50% / 0)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </motion.div>
                <span className="font-semibold text-sm font-display">AI Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Your portfolio is heavily weighted in stocks. Consider diversifying into crypto or real estate for better risk-adjusted returns.
              </p>
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto text-xs font-semibold">
                View Suggestions <ChevronRight className="w-3 h-3" />
              </Button>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-5 gap-4 mb-5">
            <motion.div {...fadeUp(0.2)} className="lg:col-span-3 glass p-6">
              <h3 className="font-semibold font-display mb-4 text-sm">Portfolio Performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={profitLossData}>
                  <defs>
                    <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152, 82%, 39%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(152, 82%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 18%, 7%)", border: "1px solid hsl(220, 12%, 14%)", borderRadius: "12px", color: "hsl(0, 0%, 98%)", fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(152, 82%, 45%)" strokeWidth={2} fill="url(#plGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div {...fadeUp(0.25)} className="lg:col-span-2 glass p-6">
              <h3 className="font-semibold font-display mb-4 text-sm">Allocation</h3>
              <div className="flex items-center justify-center">
                <PieChart width={180} height={180}>
                  <Pie data={distribution} cx={90} cy={90} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {distribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {distribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Winning Tickets + Transactions */}
          <div className="grid lg:grid-cols-2 gap-4">
            <motion.div {...fadeUp(0.3)}>
              <WinningTickets />
            </motion.div>

            <motion.div {...fadeUp(0.35)} className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold font-display text-sm">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="text-primary text-xs">View All</Button>
              </div>
              <div className="space-y-2">
                {mockTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        tx.type === "buy" ? "bg-profit/10 text-profit" :
                        tx.type === "sell" ? "bg-loss/10 text-loss" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {tx.type === "buy" ? <ArrowDownRight className="w-4 h-4" /> :
                         tx.type === "sell" ? <ArrowUpRight className="w-4 h-4" /> :
                         <Wallet className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type} {tx.asset}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">${tx.value.toLocaleString()}</p>
                      <p className={`text-xs capitalize ${tx.status === "completed" ? "text-profit" : "text-gold"}`}>{tx.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
