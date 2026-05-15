import { TABS, TabId } from "@/lib/tabs";
import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { motion } from "framer-motion";

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function Dock({ active, onChange }: Props) {
  const { locale } = useApp();
  const t = dict[locale].nav;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="px-3 pb-3 flex justify-center pointer-events-auto">
        <nav className="glass-strong shadow-float rounded-full px-2 py-2 flex items-center gap-0.5 max-w-full overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className="relative flex items-center justify-center min-w-11 h-11 px-3 rounded-full transition-colors"
                aria-label={t[tab.labelKey as keyof typeof t]}
              >
                {isActive && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-full bg-gradient-hero"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative flex items-center gap-2 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      className="text-xs font-medium whitespace-nowrap pr-1"
                    >
                      {t[tab.labelKey as keyof typeof t]}
                    </motion.span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
