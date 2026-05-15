import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { Sun, Moon, Languages, Bell, Search } from "lucide-react";
import { CircleMark } from "@/components/brand/CircleMark";

export function TopBar({ title }: { title?: string }) {
  const { theme, toggleTheme, locale, toggleLocale } = useApp();
  const t = dict[locale];
  return (
    <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top)]">
      <div className="glass rounded-full mt-3 px-3 py-2 flex items-center gap-2 shadow-glass">
        <div className="flex items-center gap-2 min-w-0">
          <CircleMark size={32} />
          <div className="leading-none min-w-0">
            <div className="font-display text-lg truncate">{title || t.appName}</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase truncate">{t.tagline}</div>
          </div>
        </div>
        <div className="flex-1" />
        <button className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center transition" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <button onClick={toggleLocale} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center transition" aria-label="Language">
          <Languages className="w-4 h-4" />
        </button>
        <button onClick={toggleTheme} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center transition" aria-label="Theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-brand-charcoal relative" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>
      </div>
    </header>
  );
}
