import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Globe, Moon, Sun, Monitor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "../layout/LanguageSwitcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AppSettings() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    const langName = languages.find(l => l.code === newLang)?.name || newLang;
    toast.success(`Language changed to ${langName}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Globe className="w-4 h-4 text-primary" /> {t("settings.language")}
        </Label>

        <Select value={lang} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full h-14 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <SelectValue placeholder="Select Language" />
            </div>
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10 max-h-[300px]">
            {languages.map((l) => (
              <SelectItem
                key={l.code}
                value={l.code}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer py-3"
              >
                <span className="mr-2">{l.flag}</span> {l.name}
              </SelectItem>
            ))}
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
