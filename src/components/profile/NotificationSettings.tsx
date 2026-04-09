import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, Zap } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    alerts: true,
    marketing: false
  });

  const toggle = (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newVal ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-4">
      {[
        { id: "email", label: "Email Notifications", desc: "Receive transaction alerts via email", icon: Mail },
        { id: "push", label: "Push Notifications", desc: "Get instant alerts on your mobile device", icon: Smartphone },
        { id: "alerts", label: "Market Alerts", desc: "Real-time updates on price movements", icon: Zap },
        { id: "marketing", label: "Marketing", desc: "News and promotional offers", icon: Bell },
      ].map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5 text-primary" />
            <div>
              <Label className="font-bold text-sm">{item.label}</Label>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          </div>
          <Switch
            checked={settings[item.id as keyof typeof settings]}
            onCheckedChange={() => toggle(item.id as keyof typeof settings)}
          />
        </div>
      ))}
    </div>
  );
}
