import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Shield, Lock } from "lucide-react";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center px-4 relative">
    <div className="absolute inset-0 gradient-hero" />
    <div className="relative w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xl font-bold font-display">Aventus-Notch</span>
        </Link>
        <h1 className="text-2xl font-bold font-display">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>

      <div className="glass-strong p-8 rounded-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary/30 border-glass-border" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" className="bg-secondary/30 border-glass-border" />
        </div>
        <Button className="w-full gradient-primary border-0 text-foreground shadow-glow py-5">Sign In</Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="bg-secondary/30 border-glass-border">Google</Button>
          <Button variant="outline" className="bg-secondary/30 border-glass-border">Apple</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-profit" /> SEC Regulated</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-profit" /> 256-bit Encrypted</span>
      </div>
    </div>
  </div>
);

export default Login;
