import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Globe, Moon, Sun, Monitor, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";

export function AppSettings() {
  const { theme, setTheme } = useTheme();
  const { lang, t } = useLanguage();

  // Map codes to names (simplified for display)
  const langNames: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    "zh-CN": "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ru: "Russian",
    ar: "Arabic",
    hi: "Hindi",
    tr: "Turkish",
    nl: "Dutch",
    pl: "Polish",
    sv: "Swedish",
    vi: "Vietnamese",
    id: "Indonesian",
    uk: "Ukrainian",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-bold">
          <Globe className="w-4 h-4 text-primary" /> {t("settings.language")}
        </Label>

        <LanguageSwitcher>
          <button
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-sm">
                {langNames[lang] || "Select Language"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </LanguageSwitcher>
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
