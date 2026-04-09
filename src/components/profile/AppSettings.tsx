import { useState } from "react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe, Moon, Sun, Monitor } from "lucide-react";

export function AppSettings() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState("en");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Globe className="w-4 h-4 text-primary" /> Language
        </Label>
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10">
            <SelectItem value="en">English (US)</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Monitor className="w-4 h-4 text-primary" /> Appearance
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "dark", label: "Dark", icon: Moon },
            { id: "light", label: "Light", icon: Sun },
            { id: "system", label: "System", icon: Monitor },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                theme === t.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
