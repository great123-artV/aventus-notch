import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { portfolioData } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { TrendingUp, Shield, Activity, BarChart3, Target } from "lucide-react";

const performanceByClass = [
  { month: "Oct", stocks: 4.2, crypto: -2.1, forex: 1.8, realEstate: 3.5, retirement: 2.1 },
  { month: "Nov", stocks: 2.8, crypto: 8.5, forex: -0.5, realEstate: 3.8, retirement: 2.3 },
  { month: "Dec", stocks: -1.5, crypto: -5.2, forex: 2.1, realEstate: 4.1, retirement: 2.5 },
  { month: "Jan", stocks: 5.3, crypto: 12.4, forex: 0.8, realEstate: 3.2, retirement: 2.0 },
  { month: "Feb", stocks: 3.1, crypto: 6.8, forex: -1.2, realEstate: 4.5, retirement: 2.8 },
  { month: "Mar", stocks: 4.8, crypto: 3.2, forex: 1.5, realEstate: 3.9, retirement: 2.4 },
];

const riskMetrics = [
  { metric: "Volatility", value: 72 },
  { metric: "Sharpe Ratio", value: 85 },
  { metric: "Max Drawdown", value: 45 },
  { metric: "Beta", value: 68 },
  { metric: "Alpha", value: 78 },
  { metric: "Diversification", value: 90 },
];

const historicalReturns = [
  { year: "2021", portfolio: 28.5, sp500: 26.9, crypto: 62.3 },
  { year: "2022", portfolio: -8.2, sp500: -19.4, crypto: -64.2 },
  { year: "2023", portfolio: 22.1, sp500: 24.2, crypto: 155.3 },
  { year: "2024", portfolio: 18.7, sp500: 23.3, crypto: 45.8 },
  { year: "2025", portfolio: 15.3, sp500: 12.8, crypto: 32.1 },
  { year: "2026 YTD", portfolio: 12.9, sp500: 8.4, crypto: 18.6 },
];

const drawdownData = Array.from({ length: 52 }, (_, i) => ({
  week: `W${i + 1}`,
  drawdown: -(Math.random() * 8 + Math.sin(i / 5) * 4).toFixed(1),
}));

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(270, 80%, 60%)",
  "hsl(45, 93%, 58%)",
  "hsl(160, 84%, 39%)",
  "hsl(340, 82%, 52%)",
];

const tabs = ["Overview", "Risk", "Returns"];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const { distribution } = portfolioData;

  const tooltipStyle = {
    background: "hsl(222, 41%, 8%)",
    border: "1px solid hsl(222, 20%, 18%)",
    borderRadius: "8px",
    color: "hsl(210, 40%, 96%)",
  };

  return (
    <AnimatedPage>
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Portfolio Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your investment performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: "Total Return", value: "+12.85%", sub: "All time", accent: "text-profit" },
            { icon: Shield, label: "Sharpe Ratio", value: "1.82", sub: "Risk-adjusted", accent: "text-primary" },
            { icon: Activity, label: "Max Drawdown", value: "-8.2%", sub: "Last 12 months", accent: "text-loss" },
            { icon: Target, label: "Win Rate", value: "68.4%", sub: "Trades won", accent: "text-gold" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              className="glass p-5 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <p className={`text-xl font-bold font-display ${card.accent}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass p-1 rounded-xl w-fit mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="grid lg:grid-cols-5 gap-5">
            {/* Performance by Asset Class */}
            <motion.div
              className="lg:col-span-3 glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Performance by Asset Class (%)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceByClass}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend />
                  <Bar dataKey="stocks" fill={COLORS[0]} radius={[4, 4, 0, 0]} name="Stocks" />
                  <Bar dataKey="crypto" fill={COLORS[1]} radius={[4, 4, 0, 0]} name="Crypto" />
                  <Bar dataKey="forex" fill={COLORS[2]} radius={[4, 4, 0, 0]} name="Forex" />
                  <Bar dataKey="realEstate" fill={COLORS[3]} radius={[4, 4, 0, 0]} name="Real Estate" />
                  <Bar dataKey="retirement" fill={COLORS[4]} radius={[4, 4, 0, 0]} name="Retirement" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Allocation Breakdown */}
            <motion.div
              className="lg:col-span-2 glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold font-display mb-4">Allocation Breakdown</h3>
              <div className="flex justify-center">
                <PieChart width={200} height={200}>
                  <Pie data={distribution} cx={100} cy={100} innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {distribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                </PieChart>
              </div>
              <div className="space-y-2 mt-4">
                {distribution.map((d) => {
                  const total = distribution.reduce((s, x) => s + x.value, 0);
                  const pct = ((d.value / total) * 100).toFixed(1);
                  return (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium">${d.value.toLocaleString()}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "Risk" && (
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Risk Radar */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Risk Profile
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={riskMetrics}>
                  <PolarGrid stroke="hsl(222, 20%, 22%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Radar dataKey="value" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Drawdown Chart */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-loss" />
                Maximum Drawdown (52 weeks)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} interval={7} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Drawdown"]} />
                  <Area type="monotone" dataKey="drawdown" stroke="hsl(0, 84%, 60%)" strokeWidth={1.5} fill="url(#ddGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Risk Metrics Table */}
            <motion.div
              className="lg:col-span-2 glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold font-display mb-4">Key Risk Indicators</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Portfolio Beta", value: "0.87", desc: "Lower volatility than market", status: "good" },
                  { label: "Value at Risk (95%)", value: "-$4,250", desc: "Daily VaR at 95% confidence", status: "warning" },
                  { label: "Sortino Ratio", value: "2.14", desc: "Downside risk-adjusted return", status: "good" },
                  { label: "Calmar Ratio", value: "1.57", desc: "Return vs max drawdown", status: "good" },
                  { label: "Tracking Error", value: "3.2%", desc: "Deviation from benchmark", status: "neutral" },
                  { label: "Information Ratio", value: "0.92", desc: "Active return per unit risk", status: "good" },
                ].map((m) => (
                  <div key={m.label} className="glass-strong p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold font-display ${
                      m.status === "good" ? "text-profit" : m.status === "warning" ? "text-loss" : "text-foreground"
                    }`}>{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "Returns" && (
          <div className="space-y-5">
            {/* Historical Returns Comparison */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-profit" />
                Annual Returns Comparison (%)
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={historicalReturns}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend />
                  <Bar dataKey="portfolio" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} name="Your Portfolio" />
                  <Bar dataKey="sp500" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="S&P 500" />
                  <Bar dataKey="crypto" fill="hsl(270, 80%, 60%)" radius={[4, 4, 0, 0]} name="Crypto Market" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Cumulative Growth */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold font-display mb-4">Cumulative Growth of $10,000</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { year: "2021", portfolio: 12850, sp500: 12690, bonds: 10200 },
                    { year: "2022", portfolio: 11796, sp500: 10210, bonds: 9950 },
                    { year: "2023", portfolio: 14402, sp500: 12681, bonds: 10350 },
                    { year: "2024", portfolio: 17095, sp500: 15636, bonds: 10750 },
                    { year: "2025", portfolio: 19711, sp500: 17637, bonds: 11200 },
                    { year: "2026", portfolio: 22254, sp500: 19118, bonds: 11550 },
                  ]}
                >
                  <defs>
                    <linearGradient id="cumPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Legend />
                  <Area type="monotone" dataKey="portfolio" stroke="hsl(160, 84%, 39%)" strokeWidth={2.5} fill="url(#cumPortfolio)" name="Your Portfolio" />
                  <Area type="monotone" dataKey="sp500" stroke="hsl(217, 91%, 60%)" strokeWidth={1.5} fill="transparent" strokeDasharray="5 5" name="S&P 500" />
                  <Area type="monotone" dataKey="bonds" stroke="hsl(45, 93%, 58%)" strokeWidth={1.5} fill="transparent" strokeDasharray="3 3" name="Bonds" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Analytics;
