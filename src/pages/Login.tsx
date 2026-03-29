import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Shield, Lock } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const Login = () => (
  <AnimatedPage>
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 gradient-hero" />
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display">Aventus-Notch</span>
          </Link>
          <h1 className="text-2xl font-bold font-display tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <div className="glass-strong p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary/30 border-border rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="bg-secondary/30 border-border rounded-xl h-11" />
          </div>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button className="w-full gradient-primary border-0 text-primary-foreground shadow-glow py-5 rounded-xl font-semibold">Sign In</Button>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">or</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="bg-secondary/20 border-border rounded-xl h-11">Google</Button>
            <Button variant="outline" className="bg-secondary/20 border-border rounded-xl h-11">Apple</Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-profit" /> SEC Regulated</span>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-profit" /> 256-bit Encrypted</span>
        </div>
      </motion.div>
    </div>
  </AnimatedPage>
);

export default Login;
