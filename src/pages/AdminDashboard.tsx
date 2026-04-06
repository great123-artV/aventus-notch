import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Eye, DollarSign, TrendingUp, Shield, Activity, Globe, Calendar, Check, X, Lock, ShieldAlert } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VisitorLog {
  id: string;
  user_id: string | null;
  page_path: string | null;
  user_agent: string | null;
  visited_at: string;
  country: string | null;
  city: string | null;
}

interface InvestmentSummary {
  user_id: string;
  total_invested: number;
  total_value: number;
  email?: string;
}

const COLORS = ["hsl(217, 91%, 60%)", "hsl(160, 84%, 39%)", "hsl(270, 80%, 60%)", "hsl(45, 93%, 58%)", "hsl(340, 82%, 52%)"];

const AdminDashboard = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [investments, setInvestments] = useState<InvestmentSummary[]>([]);
  const [pageStats, setPageStats] = useState<{ name: string; visits: number }[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    // Fetch visitor logs
    const { data: visitorData } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(200);
    
    if (visitorData) {
      setVisitors(visitorData);
      const today = new Date().toDateString();
      setTodayCount(visitorData.filter(v => new Date(v.visited_at).toDateString() === today).length);
      
      // Page stats
      const pageCounts: Record<string, number> = {};
      visitorData.forEach(v => {
        const page = v.page_path || "unknown";
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });
      setPageStats(Object.entries(pageCounts).map(([name, visits]) => ({ name, visits })).sort((a, b) => b.visits - a.visits).slice(0, 8));
    }

    // Fetch investments (admin can see all)
    const { data: investData } = await supabase
      .from("investments")
      .select("user_id, amount_invested, current_value");
    
    if (investData) {
      const grouped: Record<string, InvestmentSummary> = {};
      investData.forEach(inv => {
        if (!grouped[inv.user_id]) {
          grouped[inv.user_id] = { user_id: inv.user_id, total_invested: 0, total_value: 0 };
        }
        grouped[inv.user_id].total_invested += Number(inv.amount_invested);
        grouped[inv.user_id].total_value += Number(inv.current_value);
      });
      setInvestments(Object.values(grouped));
      setTotalUsers(Object.keys(grouped).length);
    }

    // Fetch pending transactions
    const { data: txData } = await supabase
      .from("transactions")
      .select("*, profiles(first_name, last_name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (txData) setPendingTransactions(txData);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setAuthLoading(true);
    try {
      await signIn(email, password);
      toast.success("Authenticating admin...");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTransaction = async (id: string, status: 'completed' | 'rejected') => {
    try {
      const { data, error } = await supabase.rpc("review_transaction", {
        p_transaction_id: id,
        p_new_status: status
      });

      if (error) throw error;

      toast.success(`Transaction ${status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  if (loading) return <div className="pt-24 text-center text-muted-foreground">Loading...</div>;

  // Login View
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative pt-20">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md glass-strong p-8 rounded-3xl space-y-6 shadow-2xl border-primary/20"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-glow">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@platform.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Key</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full gradient-primary border-0 text-white shadow-glow py-6 font-bold text-lg rounded-xl mt-4"
            >
              {authLoading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest pt-4">
            <Shield className="w-3 h-3" /> Encrypted Session
          </div>
        </motion.div>
      </div>
    );
  }

  // Access Denied View
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative pt-20">
        <div className="absolute inset-0 bg-loss/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md glass p-8 rounded-3xl text-center space-y-6 border-loss/20"
        >
          <div className="w-20 h-20 rounded-full bg-loss/10 mx-auto flex items-center justify-center mb-2">
            <ShieldAlert className="w-10 h-10 text-loss" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-loss">Access Denied</h1>
            <p className="text-muted-foreground mt-2">
              Your account does not have administrative privileges. This incident has been logged.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full border-white/10 hover:bg-white/5 py-6 rounded-xl font-bold"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, i) => sum + i.total_invested, 0);
  const totalValue = investments.reduce((sum, i) => sum + i.total_value, 0);

  // Generate mock daily visitor chart data from actual visitors
  const dailyVisitors = (() => {
    const days: Record<string, number> = {};
    visitors.forEach(v => {
      const day = new Date(v.visited_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[day] = (days[day] || 0) + 1;
    });
    return Object.entries(days).slice(0, 7).reverse().map(([date, count]) => ({ date, visitors: count }));
  })();

  return (
    <div className="pt-24 pb-10 px-4 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
          <p className="text-muted-foreground">Full platform overview</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Eye, label: "Today's Visits", value: todayCount, color: "text-primary" },
          { icon: Users, label: "Total Investors", value: totalUsers, color: "text-profit" },
          { icon: DollarSign, label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, color: "text-yellow-500" },
          { icon: TrendingUp, label: "Portfolio Value", value: `$${totalValue.toLocaleString()}`, color: "text-profit" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold font-display">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl">
          <h3 className="font-bold font-display mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Daily Visitors
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyVisitors}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Area type="monotone" dataKey="visitors" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#adminGrad)" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-2xl">
          <h3 className="font-bold font-display mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-profit" /> Top Pages
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pageStats}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
              <Bar dataKey="visits" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass p-6 rounded-2xl border-yellow-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold font-display text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-500" /> Pending Review
            </h3>
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold uppercase tracking-wider">
              {pendingTransactions.length} Pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Details</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-medium">{tx.profiles?.first_name} {tx.profiles?.last_name}</div>
                      <div className="text-[10px] text-muted-foreground">{tx.user_id.slice(0, 8)}...</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`capitalize font-bold ${tx.type === 'deposit' ? 'text-profit' : 'text-loss'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">${tx.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground truncate max-w-[150px]">
                      {tx.wallet_address || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleTransaction(tx.id, 'completed')}
                        className="h-8 w-8 rounded-lg border-profit/50 text-profit hover:bg-profit/10"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleTransaction(tx.id, 'rejected')}
                        className="h-8 w-8 rounded-lg border-loss/50 text-loss hover:bg-loss/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recent Visitors Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold font-display text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Recent Visitors
          </h3>
          <span className="text-xs font-bold text-muted-foreground">{visitors.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Page</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Agent</th>
              </tr>
            </thead>
            <tbody>
              {visitors.slice(0, 20).map(v => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-medium">{v.page_path || "/"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{v.user_id ? v.user_id.slice(0, 8) + "..." : "Anonymous"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(v.visited_at).toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground truncate max-w-[200px]">{v.user_agent?.slice(0, 50)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Investor Portfolios */}
      {investments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass p-6 rounded-2xl">
          <h3 className="font-bold font-display text-xl flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-yellow-500" /> Investor Portfolios
          </h3>
          <div className="space-y-3">
            {investments.map((inv, i) => {
              const profit = inv.total_value - inv.total_invested;
              const profitPct = inv.total_invested > 0 ? ((profit / inv.total_invested) * 100) : 0;
              return (
                <div key={inv.user_id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{inv.user_id.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">Invested: ${inv.total_invested.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${inv.total_value.toLocaleString()}</p>
                    <p className={`text-xs font-bold ${profit >= 0 ? "text-profit" : "text-loss"}`}>
                      {profit >= 0 ? "+" : ""}{profitPct.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
