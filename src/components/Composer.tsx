import { AnimatePresence, motion } from "framer-motion";
import { X, Image as ImageIcon, BarChart3, Mic, Send, Hash, Globe, Users, Sparkles, Plus, Trash2, Lock, Heart, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Kind = "post" | "poll" | "media";
type Target = "Public" | "Friends" | "Close Friends" | "Workspace";

const TARGETS: { k: Target; i: any; desc: string }[] = [
  { k: "Public", i: Globe, desc: "Anyone on Circle can see and reshare" },
  { k: "Friends", i: Users, desc: "Only people you follow back" },
  { k: "Close Friends", i: Heart, desc: "A private list you curate" },
  { k: "Workspace", i: Lock, desc: "Members of your active Circle workspace" },
];

export function Composer({ open, onClose, defaultTarget = "Public", initialKind, initialText }: { open: boolean; onClose: () => void; defaultTarget?: Target; initialKind?: Kind; initialText?: string }) {
  const [kind, setKind] = useState<Kind>(initialKind ?? "post");
  const [text, setText] = useState(initialText ?? "");
  const [target, setTarget] = useState<Target>(defaultTarget);
  const [audOpen, setAudOpen] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  useEffect(() => {
    if (open) { setKind(initialKind ?? "post"); setText(initialText ?? ""); }
  }, [open, initialKind, initialText]);

  const hashtags = useMemo(
    () => Array.from(text.matchAll(/#[\p{L}\d_]+/gu)).map(m => m[0]).slice(0, 4),
    [text]
  );

  const reset = () => { setText(""); setMedia([]); setPollOptions(["", ""]); setKind("post"); };

  const publish = () => {
    if (!text.trim() && media.length === 0 && kind !== "poll") {
      toast.error("Add something to share");
      return;
    }
    toast.success(`${kind === "poll" ? "Poll" : kind === "media" ? "Media update" : "Post"} published to ${target}`, {
      description: "Circle AI verified · no misinformation flags.",
    });
    reset();
    onClose();
  };

  const addMedia = () => setMedia(m => [...m, `gradient-${m.length % 4}`]);
  const setOpt = (i: number, v: string) => setPollOptions(o => o.map((x, idx) => (idx === i ? v : x)));

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
            className="fixed bottom-0 inset-x-0 z-[90] max-h-[94vh] rounded-t-[28px] glass-strong shadow-float overflow-hidden flex flex-col"
            role="dialog" aria-label="Composer"
          >
            <div className="flex justify-center pt-2"><span className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>
            <div className="px-5 pt-3 pb-2 flex items-center gap-3">
              <h2 className="font-display text-2xl flex-1">New {kind}</h2>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            {/* Kind switcher */}
            <div className="px-5 flex gap-2">
              {([
                { k: "post", l: "Post", i: Hash },
                { k: "poll", l: "Poll", i: BarChart3 },
                { k: "media", l: "Media", i: ImageIcon },
              ] as { k: Kind; l: string; i: any }[]).map(o => (
                <button key={o.k} onClick={() => setKind(o.k)}
                  className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${kind === o.k ? "bg-primary text-primary-foreground" : "glass"}`}>
                  <o.i className="w-3 h-3" /> {o.l}
                </button>
              ))}
              <div className="flex-1" />
              <div className="relative">
                <button onClick={() => setAudOpen(o => !o)}
                  className="text-xs px-3 py-1.5 rounded-full glass flex items-center gap-1.5">
                  {(() => { const Ic = TARGETS.find(x => x.k === target)!.i; return <Ic className="w-3 h-3" />; })()}
                  {target}
                </button>
                {audOpen && (
                  <div className="absolute right-0 mt-2 z-50 glass-strong rounded-2xl p-2 w-64 shadow-float">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-2">Who can see this?</div>
                    {TARGETS.map(o => (
                      <button key={o.k} onClick={() => { setTarget(o.k); setAudOpen(false); }}
                        className={`w-full text-left px-2 py-2 rounded-lg flex items-start gap-2 ${target === o.k ? "bg-primary/15" : "hover:bg-muted/50"}`}>
                        <o.i className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium flex items-center gap-1">{o.k}{target === o.k && <Check className="w-3 h-3" />}</div>
                          <div className="text-[11px] text-muted-foreground">{o.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-3 grid md:grid-cols-2 gap-4 pb-3">
              {/* Editor */}
              <div className="space-y-3">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="What's worth sharing?"
                  className="w-full min-h-[140px] bg-transparent outline-none text-[15px] leading-relaxed resize-none"
                />

                {kind === "media" && (
                  <div className="grid grid-cols-3 gap-2">
                    {media.map((m, i) => (
                      <motion.div key={i} layout className="aspect-square rounded-xl bg-gradient-mesh relative overflow-hidden">
                        <button onClick={() => setMedia(x => x.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-charcoal/60 text-cream flex items-center justify-center" aria-label="Remove">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    {media.length < 6 && (
                      <button onClick={addMedia} className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted/30">
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {kind === "poll" && (
                  <div className="space-y-2">
                    {pollOptions.map((o, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input value={o} onChange={e => setOpt(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 glass rounded-full px-4 py-2 text-sm outline-none" />
                        {pollOptions.length > 2 && (
                          <button onClick={() => setPollOptions(p => p.filter((_, j) => j !== i))} aria-label="Remove option"
                            className="w-8 h-8 rounded-full hover:bg-muted/60 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <button onClick={() => setPollOptions(p => [...p, ""])}
                        className="text-xs flex items-center gap-1 text-secondary"><Plus className="w-3 h-3" /> Add option</button>
                    )}
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center gap-1 pt-1">
                  <ToolBtn icon={ImageIcon} onClick={() => { setKind("media"); addMedia(); }} />
                  <ToolBtn icon={BarChart3} onClick={() => setKind("poll")} />
                  <ToolBtn icon={Mic} />
                  <ToolBtn icon={Sparkles} onClick={() => {
                    setText(t => t + (t ? " " : "") + "Drafted with Circle AI — feel free to edit ✨");
                  }} />
                  <div className="flex-1" />
                  <span className="text-[10px] text-muted-foreground">{text.length}/500</span>
                </div>
              </div>

              {/* Realtime preview */}
              <div className="rounded-3xl border border-border bg-card p-4 space-y-3 self-start sticky top-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Live preview</div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-hero shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium flex items-center gap-1">Yousef <span className="text-xs text-muted-foreground">@yousef · now</span></div>
                    <p className="mt-1 text-[14px] leading-relaxed whitespace-pre-wrap break-words min-h-[1em]">
                      {text || <span className="text-muted-foreground">Your post will appear here as you type.</span>}
                    </p>

                    {kind === "media" && media.length > 0 && (
                      <div className={`mt-2 grid gap-1.5 ${media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {media.slice(0, 4).map((_, i) => (
                          <div key={i} className="aspect-video rounded-xl bg-gradient-mesh" />
                        ))}
                      </div>
                    )}

                    {kind === "poll" && (
                      <div className="mt-2 space-y-1.5">
                        {pollOptions.map((o, i) => (
                          <div key={i} className="rounded-full glass px-3 py-1.5 text-xs">{o || `Option ${i + 1}`}</div>
                        ))}
                      </div>
                    )}

                    {hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {hashtags.map(h => <span key={h} className="text-[11px] text-secondary">{h}</span>)}
                      </div>
                    )}

                    <div className="mt-2 text-[10px] text-secondary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI-verified · {target}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border/60 flex items-center gap-3 pb-[env(safe-area-inset-bottom)]">
              <span className="text-[11px] text-muted-foreground flex-1">End-to-end encrypted · stored on your device</span>
              <button onClick={publish} className="px-5 py-2.5 rounded-full bg-gradient-hero text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-float">
                <Send className="w-4 h-4" /> Publish
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToolBtn({ icon: Icon, onClick }: { icon: any; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center text-secondary">
      <Icon className="w-4 h-4" />
    </button>
  );
}
