import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Send, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { portfolioData, profitLossData, mockTransactions } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { totalBalance, totalProfit, profitPercent, distribution } = portfolioData;

  return (
    <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Welcome back, Investor</h1>
        <p className="text-muted-foreground mt-1">Here's your portfolio overview</p>
      </div>

      {/* Balance + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 glass p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl sm:text-4xl font-bold font-display">${totalBalance.toLocaleString()}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${totalProfit >= 0 ? "text-profit" : "text-loss"}`}>
              {totalProfit >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              ${Math.abs(totalProfit).toLocaleString()} ({profitPercent}%)
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/markets">
              <Button size="sm" className="gradient-primary border-0 text-foreground shadow-glow">
                <TrendingUp className="w-4 h-4 mr-1" /> Invest
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="bg-secondary/30 border-glass-border">
              <Wallet className="w-4 h-4 mr-1" /> Withdraw
            </Button>
            <Button size="sm" variant="outline" className="bg-secondary/30 border-glass-border">
              <Send className="w-4 h-4 mr-1" /> Transfer
            </Button>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="glass p-6 rounded-xl border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-foreground" />
            </div>
            <span className="font-semibold text-sm font-display">AI Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Your portfolio is heavily weighted in stocks. Consider diversifying into crypto or real estate for better risk-adjusted returns.
          </p>
          <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
            View Suggestions <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-5 mb-6">
        {/* P/L Chart */}
        <div className="lg:col-span-3 glass p-6 rounded-xl">
          <h3 className="font-semibold font-display mb-4">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={profitLossData}>
              <defs>
                <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(222, 41%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#plGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Donut */}
        <div className="lg:col-span-2 glass p-6 rounded-xl">
          <h3 className="font-semibold font-display mb-4">Allocation</h3>
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
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-display">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-primary">View All</Button>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
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
                <p className="text-sm font-medium">${tx.value.toLocaleString()}</p>
                <p className={`text-xs capitalize ${tx.status === "completed" ? "text-profit" : "text-yellow-500"}`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
