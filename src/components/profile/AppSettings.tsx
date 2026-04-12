import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe, Moon, Sun, Monitor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AppSettings() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Globe className="w-4 h-4 text-primary" /> {t("settings.language")}
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
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Monitor className="w-4 h-4 text-primary" /> {t("settings.appearance")}
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "dark", label: t("settings.dark"), icon: Moon },
            { id: "light", label: t("settings.light"), icon: Sun },
            { id: "system", label: t("settings.system"), icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                theme === opt.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <opt.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
