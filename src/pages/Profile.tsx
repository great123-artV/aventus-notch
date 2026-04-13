import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { PaymentMethods } from "@/components/profile/PaymentMethods";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { AppSettings } from "@/components/profile/AppSettings";

const Profile = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { t } = useLanguage();
  const menuItems = [
    { id: "personal", icon: User, label: t("profile.personal"), desc: t("profile.personalDesc") },
    { id: "security", icon: Shield, label: t("profile.security"), desc: t("profile.securityDesc") },
    { id: "notifications", icon: Bell, label: t("profile.notifications"), desc: t("profile.notificationsDesc") },
    { id: "payments", icon: CreditCard, label: t("profile.payments"), desc: t("profile.paymentsDesc") },
    { id: "settings", icon: Settings, label: t("profile.settings"), desc: t("profile.settingsDesc") },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto space-y-8 theme-profile relative">
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
            : t("profile.investorProfile")
          }
        </h1>
        <p className="text-muted-foreground mt-1">{user?.email || t("profile.notSignedIn")}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold uppercase tracking-widest text-profit">
          <Shield className="w-3 h-3" /> {isAdmin ? "Admin" : t("profile.verifiedInvestor")}
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveSection(item.id)}
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

      <AnimatePresence>
        {activeSection && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSection(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-lg glass-strong p-8 rounded-[32px] shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">
                  {menuItems.find(i => i.id === activeSection)?.label}
                </h2>
                <button onClick={() => setActiveSection(null)} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeSection === "personal" && <PersonalInfoForm />}
              {activeSection === "security" && <SecurityForm />}
              {activeSection === "payments" && <PaymentMethods />}
              {activeSection === "notifications" && <NotificationSettings />}
              {activeSection === "settings" && <AppSettings />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Button onClick={handleLogout} variant="ghost" className="w-full h-14 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold text-lg gap-2">
        <LogOut className="w-5 h-5" /> {t("profile.logout")}
      </Button>
    </div>
  );
};

export default Profile;
