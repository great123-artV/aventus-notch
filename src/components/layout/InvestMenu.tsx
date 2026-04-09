import { motion, AnimatePresence } from "framer-motion";
import { Building2, PiggyBank, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function InvestMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/10 rounded-t-[32px] p-8 z-[70] pb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display">Start Investing</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-4">
              <Link
                to="/real-estate"
                onClick={onClose}
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Real Estate</h3>
                    <p className="text-sm text-muted-foreground">Fractional ownership in premium properties</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/retirement"
                onClick={onClose}
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <PiggyBank className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Retirement Plans</h3>
                    <p className="text-sm text-muted-foreground">Secure your future with smart saving plans</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
