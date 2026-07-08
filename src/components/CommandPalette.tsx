import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { commands } from "@/lib/mock";
import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { useMemo, useState } from "react";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useApp();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return commands;
    return commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120]"
            style={{ background: "hsl(var(--charcoal) / 0.6)", backdropFilter: "blur(8px)" }}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[12vh] inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] z-[130] glass-strong rounded-2xl shadow-float overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={dict[locale].palette.placeholder}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">ESC</kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 text-secondary" />
                  Ask Cirkel Brain to do it instead
                </div>
              ) : (
                Object.entries(
                  filtered.reduce<Record<string, typeof commands>>((acc, c) => {
                    (acc[c.group] = acc[c.group] || []).push(c);
                    return acc;
                  }, {})
                ).map(([group, items]) => (
                  <div key={group} className="px-2 mb-2">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">{group}</div>
                    {items.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          const label = c.label.toLowerCase();
                          if (label.includes("pulse")) {
                            window.dispatchEvent(new CustomEvent("circle:pulse"));
                          } else if (label.includes("hub") || label.includes("verify") || label.includes("mail")) {
                            window.dispatchEvent(new CustomEvent("circle:hub"));
                          } else if (label.includes("governance")) {
                            window.dispatchEvent(new CustomEvent("circle:governance"));
                          } else if (label.includes("compose") || label.includes("post")) {
                            window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "post" } }));
                          } else if (label.includes("space")) {
                            window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "media" } }));
                          } else {
                            window.dispatchEvent(new CustomEvent("circle:ai"));
                          }
                          onClose();
                        }}
                        className="w-full text-start px-3 py-2.5 rounded-xl hover:bg-muted/60 flex items-center gap-3 group transition"
                      >
                        <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition" />
                        </span>
                        <span className="text-sm flex-1">{c.label}</span>
                        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{c.hint}</kbd>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>↑ ↓ to navigate · ↵ to run</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-secondary" /> Powered by on-device AI</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
