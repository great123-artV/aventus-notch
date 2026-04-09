import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export function SecurityForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-profit" />
          <div>
            <p className="font-bold text-sm">Two-Factor Authentication</p>
            <p className="text-[10px] text-muted-foreground">Extra layer of security for your account</p>
          </div>
        </div>
        <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <p className="font-bold text-sm">Change Password</p>
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5 border-white/10" />
        </div>
        <div className="space-y-2">
          <Label>Confirm New Password</Label>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-white/5 border-white/10" />
        </div>
        <Button onClick={handlePasswordChange} disabled={loading || !password} className="w-full gradient-primary border-0 font-bold">
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Update Password
        </Button>
      </div>
    </div>
  );
}
