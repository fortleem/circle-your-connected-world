import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Sparkles, ShieldCheck } from "lucide-react";
import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { aiSeed } from "@/lib/mock";
import { useState } from "react";

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useApp();
  const t = dict[locale].ai;
  const [messages, setMessages] = useState(aiSeed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: `u${Date.now()}`, role: "me", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, {
        id: `a${Date.now()}`,
        role: "ai",
        text: "Drafting a thoughtful answer privately on your device — every token stays here.",
      }]);
    }, 600);
  };

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
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-[90] max-h-[88vh] rounded-t-[28px] glass-strong shadow-float overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-2"><span className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4 flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-gradient-mesh animate-orb-float flex items-center justify-center">
                <div className="absolute inset-0.5 rounded-full bg-background/30 backdrop-blur-md" />
                <Sparkles className="relative w-5 h-5" style={{ color: "hsl(var(--cream))" }} />
              </div>
              <div className="flex-1">
                <div className="font-display text-lg leading-tight">{t.title}</div>
                <div className="text-[10px] flex items-center gap-1 text-secondary"><ShieldCheck className="w-3 h-3" /> {t.sub}</div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-3">
              {messages.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={m.role === "me"
                    ? "ms-auto max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm bg-gradient-hero text-primary-foreground"
                    : "me-auto max-w-[90%] text-sm leading-relaxed"}>
                  {m.role === "ai" && <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Circle AI</div>}
                  <div className={m.role === "ai" ? "text-foreground/90" : ""}>{m.text}</div>
                </motion.div>
              ))}
            </div>

            {/* Examples */}
            <div className="px-5 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {t.examples.map(e => (
                <button key={e} onClick={() => send(e)}
                  className="text-xs px-3 py-1.5 rounded-full glass border-secondary/30 whitespace-nowrap shrink-0">
                  {e}
                </button>
              ))}
            </div>

            {/* Composer */}
            <div className="px-3 pb-[env(safe-area-inset-bottom)] pb-4">
              <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="glass-strong rounded-full px-3 py-2 flex items-center gap-2 shadow-float">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm py-1.5 px-2"
                  placeholder={t.placeholder}
                />
                <button type="button" className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center"><Mic className="w-4 h-4" /></button>
                <button type="submit" className="w-9 h-9 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center"><Send className="w-4 h-4" /></button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
