import React, { useState, useEffect } from "react";
import { Search, Globe, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  name: string;
  code: string;
  flag: string;
}

const languages: Language[] = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Spanish", code: "es", flag: "🇪🇸" },
  { name: "French", code: "fr", flag: "🇫🇷" },
  { name: "German", code: "de", flag: "🇩🇪" },
  { name: "Chinese", code: "zh-CN", flag: "🇨🇳" },
  { name: "Japanese", code: "ja", flag: "🇯🇵" },
  { name: "Korean", code: "ko", flag: "🇰🇷" },
  { name: "Russian", code: "ru", flag: "🇷🇺" },
  { name: "Arabic", code: "ar", flag: "🇸🇦" },
  { name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { name: "Italian", code: "it", flag: "🇮🇹" },
  { name: "Hindi", code: "hi", flag: "🇮🇳" },
  { name: "Dutch", code: "nl", flag: "🇳🇱" },
  { name: "Turkish", code: "tr", flag: "🇹🇷" },
  { name: "Greek", code: "el", flag: "🇬🇷" },
  { name: "Swedish", code: "sv", flag: "🇸🇪" },
  { name: "Polish", code: "pl", flag: "🇵🇱" },
  { name: "Norwegian", code: "no", flag: "🇳🇴" },
  { name: "Danish", code: "da", flag: "🇩🇰" },
  { name: "Finnish", code: "fi", flag: "🇫🇮" },
  { name: "Thai", code: "th", flag: "🇹🇭" },
  { name: "Vietnamese", code: "vi", flag: "🇻🇳" },
  { name: "Indonesian", code: "id", flag: "🇮🇩" },
  { name: "Hebrew", code: "iw", flag: "🇮🇱" },
  { name: "Bengali", code: "bn", flag: "🇧🇩" },
  { name: "Czech", code: "cs", flag: "🇨🇿" },
  { name: "Hungarian", code: "hu", flag: "🇭🇺" },
  { name: "Romanian", code: "ro", flag: "🇷🇴" },
  { name: "Slovak", code: "sk", flag: "🇸🇰" },
  { name: "Ukrainian", code: "uk", flag: "🇺🇦" },
  { name: "Malay", code: "ms", flag: "🇲🇾" },
  { name: "Filipino", code: "tl", flag: "🇵🇭" },
  { name: "Afrikaans", code: "af", flag: "🇿🇦" },
  { name: "Amharic", code: "am", flag: "🇪🇹" },
  { name: "Azerbaijani", code: "az", flag: "🇦🇿" },
  { name: "Belarusian", code: "be", flag: "🇧🇾" },
  { name: "Bulgarian", code: "bg", flag: "🇧🇬" },
  { name: "Catalan", code: "ca", flag: "🇪🇸" },
  { name: "Croatian", code: "hr", flag: "🇭🇷" },
  { name: "Esperanto", code: "eo", flag: "🏳️" },
  { name: "Estonian", code: "et", flag: "🇪🇪" },
  { name: "Georgian", code: "ka", flag: "🇬🇪" },
  { name: "Gujarati", code: "gu", flag: "🇮🇳" },
  { name: "Haitian Creole", code: "ht", flag: "🇭🇹" },
  { name: "Irish", code: "ga", flag: "🇮🇪" },
  { name: "Kannada", code: "kn", flag: "🇮🇳" },
  { name: "Latin", code: "la", flag: "🏛️" },
  { name: "Latvian", code: "lv", flag: "🇱🇻" },
  { name: "Lithuanian", code: "lt", flag: "🇱🇹" },
  { name: "Macedonian", code: "mk", flag: "🇲🇰" },
];

interface LanguageSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageSwitcher({ open, onOpenChange }: LanguageSwitcherProps) {
  const [search, setSearch] = useState("");
  const { lang: currentLangCode, setLang } = useLanguage();

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLanguageSelect = (selectedLang: Language) => {
    // 1. Update our internal context (changes some UI strings immediately)
    setLang(selectedLang.code);

    // 2. Trigger Google Translate
    const googleTranslateDropdown = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleTranslateDropdown) {
      googleTranslateDropdown.value = selectedLang.code;
      googleTranslateDropdown.dispatchEvent(new Event("change"));

      toast.success(`Language changed to ${selectedLang.name}`);
      onOpenChange(false);
    } else {
      // Fallback if Google Translate hasn't loaded yet
      toast.error("Translation engine is still loading. Please try again in a moment.");

      // Try to re-initiate if it's missing but we really want it
      if (window.location.host.includes('localhost') || window.location.host.includes('lovable')) {
         console.warn("Google Translate not found in development/preview");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold font-display flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> Select Language
          </DialogTitle>
          <p className="text-muted-foreground text-sm">Choose your preferred language for the ecosystem.</p>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] px-2 pb-6">
          <div className="grid grid-cols-1 gap-1 px-4">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className="font-bold text-sm">{lang.name}</p>
                    {currentLangCode === lang.code && (
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
