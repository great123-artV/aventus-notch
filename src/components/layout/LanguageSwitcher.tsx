import React, { useState } from "react";
import { Search, Globe, ChevronRight, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LanguageSwitcher({ children, open, onOpenChange }: LanguageSwitcherProps) {
  const [search, setSearch] = useState("");
  const { lang: currentLangCode, setLang } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang.code);

    const googleTranslateDropdown = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleTranslateDropdown) {
      googleTranslateDropdown.value = selectedLang.code;
      googleTranslateDropdown.dispatchEvent(new Event("change"));

      toast.success(`Language changed to ${selectedLang.name}`);
      setOpen(false);
    } else {
      toast.error("Translation engine is still loading. Please try again in a moment.");
    }
  };

  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{currentLang.name}</span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 glass-strong border-white/10" align="end" sideOffset={8}>
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white/5 border-white/10 rounded-lg text-sm"
            />
          </div>
        </div>

        <ScrollArea className="h-[350px]">
          <div className="p-2">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang)}
                className={cn(
                  "flex items-center justify-between w-full p-2.5 rounded-lg transition-colors group",
                  currentLangCode === lang.code
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-white/5 text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-bold text-sm">{lang.name}</span>
                </div>
                {currentLangCode === lang.code ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
