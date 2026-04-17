import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Shield, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative theme-auth">
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

        <form onSubmit={handleSubmit} className="glass-strong p-8 rounded-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-secondary/30 border-glass-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-secondary/30 border-glass-border" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-foreground shadow-glow py-5">
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </form>

        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-profit" /> SEC Regulated</span>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-profit" /> 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
