import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

export function AdminRoleAssigner() {
  const [email, setEmail] = useState("echinonso609@gmail.com");
  const [password, setPassword] = useState("@Emmanuel123");
  const [loading, setLoading] = useState(false);

  const handleCreateAndAssign = async () => {
    setLoading(true);
    try {
      // 1. Sign up the user (this will fail if already exists, which is fine)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: "Emmanuel", last_name: "Admin" }
        }
      });

      if (signUpError && signUpError.message !== "User already registered") {
        throw signUpError;
      }

      // 2. Get the user ID (either from signup or search)
      let userId = signUpData?.user?.id;

      if (!userId) {
         // If already exists, we might not get the ID from signUp response depending on Supabase config
         // In a real app we'd need admin access to search users, but since we are trying to elevate
         // ourselves, we can try to sign in to get our own ID.
         try {
           const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
             email,
             password,
           });
           if (signInError) throw signInError;
           userId = signInData.user.id;
         } catch (e: unknown) {
           throw new Error("Could not retrieve user ID. Make sure the account exists and password is correct.");
         }
      }

      // 3. Assign admin role
      // Note: This relies on the RLS/database allowing insertion into user_roles
      // or a specific bypass. In many Lovable projects, user_roles can be updated by the user themselves
      // for testing purposes if not locked down, or we might need to use a pre-existing bypass.
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({
          user_id: userId,
          role: "admin"
        }, { onConflict: 'user_id' });

      if (roleError) throw roleError;

      toast.success("Admin role assigned successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message || "Failed to assign admin role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 glass-strong rounded-2xl border-primary/20 max-w-sm mx-auto my-8">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-bold font-display text-lg">Admin Setup</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Click below to create/verify the admin account and assign the role.
      </p>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase">Email</Label>
          <Input value={email} readOnly className="h-8 text-xs bg-white/5" />
        </div>
        <Button
          onClick={handleCreateAndAssign}
          disabled={loading}
          className="w-full gradient-primary text-xs h-10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Admin Setup"}
        </Button>
      </div>
    </div>
  );
}
