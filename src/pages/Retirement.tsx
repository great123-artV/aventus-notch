import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { retirementPlans } from "@/lib/mock-data";
import { PiggyBank, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const Retirement = () => {
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(25);
  const [returnRate, setReturnRate] = useState(8);

  const { futureValue, chartData } = useMemo(() => {
    const r = returnRate / 100 / 12;
    const n = years * 12;
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const data = [];
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const val = monthly * ((Math.pow(1 + r, m) - 1) / r);
      const contrib = monthly * m;
      data.push({ year: `Year ${y}`, projected: Math.round(val), contributions: Math.round(contrib) });
    }
    return { futureValue: fv, chartData: data };
  }, [monthly, years, returnRate]);

  return (
    <AnimatedPage>
      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Retirement Planner</h1>
          <p className="text-muted-foreground mt-1">Project your financial future with interactive tools</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            className="lg:col-span-2 glass p-6 rounded-xl space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium">Monthly Contribution</label>
                <span className="text-sm font-bold text-primary">${monthly.toLocaleString()}</span>
              </div>
              <Slider value={[monthly]} onValueChange={(v) => setMonthly(v[0])} min={100} max={10000} step={100} />
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium">Investment Period</label>
                <span className="text-sm font-bold text-primary">{years} years</span>
              </div>
              <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={5} max={40} step={1} />
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium">Expected Annual Return</label>
                <span className="text-sm font-bold text-primary">{returnRate}%</span>
              </div>
              <Slider value={[returnRate]} onValueChange={(v) => setReturnRate(v[0])} min={3} max={15} step={0.5} />
            </div>

            <motion.div
              className="glass-strong p-5 rounded-xl text-center"
              key={futureValue}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Projected Future Value</p>
              <p className="text-3xl font-bold font-display text-gradient">${Math.round(futureValue).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total contributed: ${(monthly * years * 12).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-3 glass p-6 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="font-semibold font-display mb-4">Growth Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} interval={Math.floor(years / 5)} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 41%, 8%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="projected" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#projGrad)" name="Projected" />
                <Area type="monotone" dataKey="contributions" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#contribGrad)" name="Contributions" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold font-display mb-5">Suggested Plans</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {retirementPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="glass p-6 rounded-xl hover:border-primary/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.risk === "Low" ? "bg-profit/10" : plan.risk === "Medium" ? "bg-primary/10" : "bg-loss/10"
                  }`}>
                    {plan.risk === "Low" ? <Shield className="w-5 h-5 text-profit" /> :
                     plan.risk === "Medium" ? <PiggyBank className="w-5 h-5 text-primary" /> :
                     <TrendingUp className="w-5 h-5 text-loss" />}
                  </div>
                  <div>
                    <h4 className="font-semibold font-display">{plan.name}</h4>
                    <span className={`text-xs font-medium ${
                      plan.risk === "Low" ? "text-profit" : plan.risk === "Medium" ? "text-primary" : "text-loss"
                    }`}>{plan.risk} Risk • {plan.returnRate}% avg</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <Button variant="outline" className="w-full bg-secondary/30 border-glass-border" size="sm">Select Plan</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Retirement;
