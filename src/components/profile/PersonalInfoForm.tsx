import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PersonalInfoForm() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName }
    });

    if (error) {
      toast.error(error.message);
    } else {
      // Also update profiles table
      await supabase.from("profiles").update({ first_name: firstName, last_name: lastName }).eq("user_id", user!.id);
      toast.success("Profile updated successfully");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-white/5 border-white/10" />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-white/5 border-white/10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Email Address</Label>
        <Input value={user?.email || ""} disabled className="bg-white/5 border-white/10 opacity-50" />
      </div>
      <Button onClick={handleUpdate} disabled={loading} className="w-full gradient-primary border-0 font-bold">
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}
