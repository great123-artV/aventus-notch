import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Personal Information", desc: "Update your details and account settings" },
    { icon: Shield, label: "Security & Privacy", desc: "Manage your password and 2FA" },
    { icon: Bell, label: "Notifications", desc: "Configure your alert preferences" },
    { icon: CreditCard, label: "Payment Methods", desc: "Manage your bank accounts and cards" },
    { icon: Settings, label: "App Settings", desc: "Theme and language preferences" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full gradient-primary p-1 mb-4 shadow-glow neon-glow-primary"
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold font-display">
          {user?.user_metadata?.first_name
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
            : "Investor Profile"
          }
        </h1>
        <p className="text-muted-foreground mt-1">{user?.email || "Not signed in"}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold uppercase tracking-widest text-profit">
          <Shield className="w-3 h-3" /> {isAdmin ? "Admin" : "Verified Investor"}
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group border-white/5 hover:border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      <Button onClick={handleLogout} variant="ghost" className="w-full h-14 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold text-lg gap-2">
        <LogOut className="w-5 h-5" /> Log Out
      </Button>
    </div>
  );
};

export default Profile;
