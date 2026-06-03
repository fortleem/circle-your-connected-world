import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, Type, Contrast as ContrastIcon, Sparkles, Accessibility } from "lucide-react";
import { useApp } from "@/providers/AppProvider";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    reducedMotion, setReducedMotion,
    contrast, setContrast,
    textScale, setTextScale,
    theme, toggleTheme, locale, toggleLocale,
  } = useApp();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-charcoal/50 backdrop-blur-md"
            style={{ background: "hsl(var(--charcoal) / 0.55)" }}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 bottom-0 end-0 z-[90] w-[92vw] max-w-md glass-strong shadow-float overflow-y-auto"
            role="dialog" aria-label="Motion & accessibility settings"
          >
            <div className="sticky top-0 px-5 py-4 flex items-center gap-3 glass-strong border-b border-border/60">
              <Accessibility className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-xl flex-1">Motion & Accessibility</h2>
              <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <Section icon={Zap} title="Motion" sub="Optimize performance and comfort">
                <Toggle
                  label="Reduced motion"
                  hint="Disables decorative animations app-wide"
                  value={reducedMotion}
                  onChange={setReducedMotion}
                />
                <p className="text-[11px] text-muted-foreground px-1">
                  Circle also respects your system's prefers-reduced-motion setting.
                </p>
              </Section>

              <Section icon={ContrastIcon} title="Contrast" sub="Make text and borders stronger">
                <div className="grid grid-cols-2 gap-2">
                  {(["standard", "high"] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setContrast(c)}
                      className={`px-3 py-3 rounded-2xl border text-sm capitalize transition ${
                        contrast === c ? "bg-primary text-primary-foreground border-primary" : "glass"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Section>

              <Section icon={Type} title="Typography scale" sub={`Current ${(textScale * 100).toFixed(0)}%`}>
                <input
                  type="range" min={0.9} max={1.3} step={0.05}
                  value={textScale}
                  onChange={e => setTextScale(parseFloat(e.target.value))}
                  className="w-full accent-secondary"
                  aria-label="Typography scale"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                  <span>A</span><span className="text-lg">A</span><span className="text-2xl">A</span>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3">
                  <div className="font-display text-xl">Quick fox jumps</div>
                  <div className="text-sm text-muted-foreground">Preview reflects your current scale.</div>
                </div>
              </Section>

              <Section icon={Sparkles} title="Theme & locale" sub="Quick switches">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={toggleTheme} className="glass rounded-2xl py-3 text-sm capitalize">
                    Theme · {theme}
                  </button>
                  <button onClick={toggleLocale} className="glass rounded-2xl py-3 text-sm">
                    {locale === "ar" ? "العربية" : "English"}
                  </button>
                </div>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ icon: Icon, title, sub, children }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-secondary" />
        <div>
          <div className="font-display text-base leading-none">{title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full text-start flex items-center gap-3 p-3 rounded-2xl glass hover:bg-muted/30 transition"
      aria-pressed={value}
    >
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <span className={`w-10 h-6 rounded-full relative transition ${value ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-all ${value ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
