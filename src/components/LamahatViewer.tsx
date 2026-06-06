import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, MessageCircle, Send, Bookmark, Smile, Sparkles, MapPin, MoreHorizontal, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SCENES, AVATARS } from "@/lib/mockImages";
import { toast } from "sonner";

type Mode = "post" | "story";

export function LamahatViewer({ open, mode, index, onClose }: { open: boolean; mode: Mode; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { setI(index); setProgress(0); }, [index, open]);

  useEffect(() => {
    if (!open || mode !== "story") return;
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setI(v => (v + 1) % SCENES.length); return 0; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(t);
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI(v => (v + 1) % SCENES.length);
      if (e.key === "ArrowLeft") setI(v => (v - 1 + SCENES.length) % SCENES.length);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const cover = SCENES[i % SCENES.length];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-3">

          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-cream" aria-label="Close">
            <X className="w-5 h-5" />
          </button>

          {mode === "story" ? (
            <div className="relative w-full max-w-md aspect-[9/16] rounded-3xl overflow-hidden shadow-float">
              <motion.img key={i} src={cover} initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
              {/* story progress bars */}
              <div className="absolute top-3 inset-x-3 flex gap-1">
                {SCENES.map((_, idx) => (
                  <div key={idx} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                    <div className="h-full bg-cream" style={{ width: `${idx < i ? 100 : idx === i ? progress : 0}%` }} />
                  </div>
                ))}
              </div>
              <div className="absolute top-7 inset-x-3 flex items-center gap-2 text-cream">
                <img src={AVATARS[i % AVATARS.length]} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="text-sm font-medium">@layla.studio</div>
                <span className="text-[11px] opacity-70">· 2h</span>
              </div>
              <div className="absolute bottom-20 inset-x-4 text-cream text-sm leading-relaxed">Golden hour in AlUla — third roll on the new lens 📷</div>
              <div className="absolute bottom-4 inset-x-3 flex items-center gap-2">
                <input placeholder="Reply to story…" className="flex-1 glass-strong rounded-full px-4 py-2.5 text-sm outline-none text-cream placeholder:text-cream/60" />
                <button onClick={() => { setLiked(l => !l); toast("❤️ Reaction sent"); }} className="w-10 h-10 rounded-full glass-strong text-cream flex items-center justify-center"><Heart className={`w-5 h-5 ${liked ? "fill-current text-rose" : ""}`} /></button>
                <button className="w-10 h-10 rounded-full glass-strong text-cream flex items-center justify-center"><Send className="w-4 h-4" /></button>
              </div>
              <button onClick={() => setI(v => (v - 1 + SCENES.length) % SCENES.length)} className="absolute left-0 top-1/4 bottom-1/4 w-1/3" aria-label="Prev" />
              <button onClick={() => setI(v => (v + 1) % SCENES.length)} className="absolute right-0 top-1/4 bottom-1/4 w-1/3" aria-label="Next" />
            </div>
          ) : (
            <div className="w-full max-w-5xl grid md:grid-cols-[1.4fr_1fr] gap-0 bg-card rounded-3xl overflow-hidden shadow-float max-h-[90vh]">
              <div className="relative bg-black aspect-square md:aspect-auto">
                <motion.img key={i} src={cover} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 w-full h-full object-cover" alt="" />
                <button onClick={() => setI(v => (v - 1 + SCENES.length) % SCENES.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-strong flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setI(v => (v + 1) % SCENES.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-strong flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
                  {SCENES.slice(0, 4).map((_, idx) => <span key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === i % 4 ? "bg-cream" : "bg-cream/40"}`} />)}
                </div>
              </div>
              <div className="flex flex-col min-h-0">
                <div className="p-3 flex items-center gap-3 border-b border-border">
                  <img src={AVATARS[i % AVATARS.length]} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">@layla.studio</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> AlUla, Saudi Arabia</div>
                  </div>
                  <button className="text-xs text-secondary">Follow</button>
                  <button aria-label="More"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  <div className="flex gap-2">
                    <img src={AVATARS[i % AVATARS.length]} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="text-sm"><span className="font-medium">@layla.studio</span> Golden hour in AlUla — third roll on the new lens. <span className="text-secondary">#lamahat</span> <span className="text-secondary">#alula</span></div>
                  </div>
                  {[
                    { u: "@noura", t: "This is unreal 😍" },
                    { u: "@majidf", t: "Which lens? Sigma?" },
                    { u: "@khalid", t: "Saved for inspiration." },
                    { u: "@sara_h", t: "Took my breath away ✨" },
                  ].map(c => (
                    <div key={c.u} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-mesh shrink-0" />
                      <div className="flex-1 text-sm"><span className="font-medium">{c.u}</span> {c.t}</div>
                      <button aria-label="Like"><Heart className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  ))}
                  <button onClick={() => toast.success("Memory remix created", { description: "AI made a 12s reel from this collection." })}
                    className="w-full glass rounded-2xl p-3 text-left text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" /> Remix this into a Mashahd reel with AI
                  </button>
                </div>
                <div className="border-t border-border p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <button onClick={() => setLiked(l => !l)} aria-label="Like" className="w-9 h-9 flex items-center justify-center"><Heart className={`w-5 h-5 ${liked ? "fill-current text-rose" : ""}`} /></button>
                    <button aria-label="Comment" className="w-9 h-9 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></button>
                    <button aria-label="Share" className="w-9 h-9 flex items-center justify-center" onClick={() => toast("Shared to Wasl")}><Send className="w-5 h-5" /></button>
                    <button aria-label="Audio" className="w-9 h-9 flex items-center justify-center"><Volume2 className="w-5 h-5" /></button>
                    <div className="flex-1" />
                    <button onClick={() => setSaved(s => !s)} aria-label="Save" className="w-9 h-9 flex items-center justify-center"><Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} /></button>
                  </div>
                  <div className="text-xs font-medium">{liked ? "1,249" : "1,248"} likes</div>
                  <div className="text-[11px] text-muted-foreground">2 hours ago</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button aria-label="Emoji"><Smile className="w-4 h-4 text-muted-foreground" /></button>
                    <input placeholder="Add a comment…" className="flex-1 bg-transparent outline-none text-sm" />
                    <button className="text-xs font-medium text-secondary">Post</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
