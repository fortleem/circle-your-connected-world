import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Sparkles, ShieldCheck, Wand2, FileText, BarChart3, Scale, ScanLine } from "lucide-react";
import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { aiSeed } from "@/lib/mock";
import { useState } from "react";
import { toast } from "sonner";

export type AIAction =
  | { type: "open-composer"; kind?: "post" | "poll" | "media"; draft?: string }
  | { type: "open-governance" }
  | { type: "navigate"; tab: string }
  | { type: "toggle-ghost" }
  | { type: "scan-pay" };

type Msg = { id: string; role: "ai" | "me"; text: string; chips?: { label: string; action: AIAction; icon?: any }[] };

export function AIAssistant({
  open, onClose, onAction,
}: { open: boolean; onClose: () => void; onAction?: (a: AIAction) => void }) {
  const { locale } = useApp();
  const t = dict[locale].ai;
  const [messages, setMessages] = useState<Msg[]>(aiSeed as Msg[]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const respond = (text: string) => {
    const lower = text.toLowerCase();
    let reply: Msg = { id: `a${Date.now()}`, role: "ai", text: "" };

    if (/summari[sz]e|tldr|digest/.test(lower)) {
      reply.text = "Here's your 3-bullet digest:\n• 12 unread messages — 4 marked urgent by your filters.\n• Diriyah Light Festival opens tonight; 3 friends RSVP'd.\n• Governance proposal pr1 closes in 2d 14h — your stance is pending.";
      reply.chips = [
        { label: "Open governance", action: { type: "open-governance" }, icon: Scale },
        { label: "Draft a reply post", action: { type: "open-composer", kind: "post", draft: "My take on tonight's festival: " }, icon: FileText },
      ];
    } else if (/poll/.test(lower)) {
      reply.text = "Drafted a poll for you. Tap to refine and publish.";
      reply.chips = [{ label: "Open poll composer", action: { type: "open-composer", kind: "poll" }, icon: BarChart3 }];
    } else if (/(write|draft|compose|post)/.test(lower)) {
      const draft = text.replace(/^(write|draft|compose|post)[: ]*/i, "");
      reply.text = "Drafted a post from your idea. Review the preview before publishing.";
      reply.chips = [{ label: "Open composer", action: { type: "open-composer", kind: "post", draft: draft || "Quick thought — " }, icon: FileText }];
    } else if (/govern|vote|proposal/.test(lower)) {
      reply.text = "Two proposals are open for voting right now. Want to review them?";
      reply.chips = [{ label: "Governance center", action: { type: "open-governance" }, icon: Scale }];
    } else if (/ghost|privacy/.test(lower)) {
      reply.text = "Toggling Ghost mode — you'll vanish from presence everywhere.";
      reply.chips = [{ label: "Toggle Ghost mode", action: { type: "toggle-ghost" }, icon: ShieldCheck }];
    } else if (/pay|scan/.test(lower)) {
      reply.text = "Opening Scan & Pay. Hold near any merchant QR or NFC point.";
      reply.chips = [{ label: "Scan & Pay", action: { type: "scan-pay" }, icon: ScanLine }];
    } else {
      reply.text = "Got it. I can summarize, draft posts/polls, open governance, or run quick actions. Tell me what you'd like.";
      reply.chips = [
        { label: "Summarize my day", action: { type: "open-composer", kind: "post", draft: "" }, icon: Wand2 },
      ];
    }
    setMessages(m => [...m, reply]);
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: `u${Date.now()}`, role: "me", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => { respond(text); setThinking(false); }, 650);
  };

  const handleChip = (a: AIAction) => {
    if (a.type === "toggle-ghost") toast.success("Ghost mode enabled");
    onAction?.(a);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] backdrop-blur-md"
            style={{ background: "hsl(var(--charcoal) / 0.55)" }}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-[90] max-h-[88vh] rounded-t-[28px] glass-strong shadow-float overflow-hidden flex flex-col"
          >
            <div className="flex justify-center pt-2"><span className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>

            <div className="px-5 pt-3 pb-4 flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-gradient-mesh animate-orb-float flex items-center justify-center">
                <div className="absolute inset-0.5 rounded-full bg-background/30 backdrop-blur-md" />
                <Sparkles className="relative w-5 h-5" style={{ color: "hsl(var(--cream))" }} />
              </div>
              <div className="flex-1">
                <div className="font-display text-lg leading-tight">{t.title}</div>
                <div className="text-[10px] flex items-center gap-1 text-secondary"><ShieldCheck className="w-3 h-3" /> {t.sub} · on-device actions</div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-3">
              {messages.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={m.role === "me"
                    ? "ms-auto max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm bg-gradient-hero text-primary-foreground whitespace-pre-wrap"
                    : "me-auto max-w-[92%] text-sm leading-relaxed"}>
                  {m.role === "ai" && <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Circle AI</div>}
                  <div className={m.role === "ai" ? "text-foreground/90 whitespace-pre-wrap" : ""}>{m.text}</div>
                  {m.chips && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.chips.map((c, i) => (
                        <button key={i} onClick={() => handleChip(c.action)}
                          className="text-xs px-3 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary flex items-center gap-1.5 hover:bg-secondary/25 transition">
                          {c.icon && <c.icon className="w-3 h-3" />} {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {thinking && (
                <div className="me-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
                  Circle AI is thinking…
                </div>
              )}
            </div>

            <div className="px-5 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {["Summarize my day", "Draft a post about today", "Create a poll: tea or coffee", "Open governance"].map(e => (
                <button key={e} onClick={() => send(e)}
                  className="text-xs px-3 py-1.5 rounded-full glass whitespace-nowrap shrink-0">
                  {e}
                </button>
              ))}
            </div>

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
