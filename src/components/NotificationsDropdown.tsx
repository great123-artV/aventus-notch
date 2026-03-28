import { useState } from "react";
import { Bell, TrendingUp, AlertTriangle, CheckCircle2, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  { id: 1, icon: TrendingUp, title: "Bitcoin surged +5.2%", desc: "Your BTC holding gained $312 today", time: "2m ago", type: "profit" },
  { id: 2, icon: AlertTriangle, title: "Stop-loss triggered", desc: "TSLA position closed at $245.80", time: "15m ago", type: "warning" },
  { id: 3, icon: CheckCircle2, title: "Deposit confirmed", desc: "$10,000 USD credited to your account", time: "1h ago", type: "success" },
  { id: 4, icon: Gift, title: "New: Real Estate Fund", desc: "Miami Beach Resort now open for investment", time: "3h ago", type: "info" },
  { id: 5, icon: TrendingUp, title: "Portfolio milestone", desc: "You've reached $280K total portfolio value!", time: "5h ago", type: "profit" },
];

const typeColors: Record<string, string> = {
  profit: "text-profit bg-profit/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  success: "text-profit bg-profit/10",
  info: "text-primary bg-primary/10",
};

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        <motion.span
          className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-80 glass-strong rounded-xl shadow-neon overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm font-display">Notifications</span>
                <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer border-b border-border/50 last:border-0"
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                        <n.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
