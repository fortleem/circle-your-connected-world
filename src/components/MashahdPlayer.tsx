import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, MessageCircle, Share2, Bookmark, Music, Sparkles, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Subtitles, Settings, Gift, Bell, ListVideo, ThumbsUp, ThumbsDown, Scissors, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { reels } from "@/lib/mock";
import { SCENES } from "@/lib/mockImages";
import { toast } from "sonner";

export function MashahdPlayer({ open, index, onClose }: { open: boolean; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [theater, setTheater] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<"Auto" | "1080p" | "4K">("Auto");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { setI(index); }, [index, open]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setInterval(() => setProgress(p => (p + 0.6) % 100), 120);
    return () => clearInterval(t);
  }, [open, playing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
      if (e.key === "m") setMuted(m => !m);
      if (e.key === "t") setTheater(t => !t);
      if (e.key === "ArrowDown") setI(v => Math.min(v + 1, reels.length - 1));
      if (e.key === "ArrowUp") setI(v => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const r = reels[i] ?? reels[0];
  const cover = SCENES[(i + 3) % SCENES.length];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-charcoal text-cream flex flex-col"
        >
          {/* top bar */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center gap-2 p-3 bg-gradient-to-b from-black/70 to-transparent">
            <button onClick={onClose} className="w-10 h-10 rounded-full glass-strong flex items-center justify-center" aria-label="Close"><X className="w-5 h-5" /></button>
            <div className="text-xs opacity-80">Mashahd · Cinema mode</div>
            <div className="flex-1" />
            <button onClick={() => setCaptions(c => !c)} className={`w-10 h-10 rounded-full flex items-center justify-center ${captions ? "bg-secondary text-brand-charcoal" : "glass-strong"}`} aria-label="Captions"><Subtitles className="w-4 h-4" /></button>
            <button onClick={() => toast("AI dubbing: Arabic ⇄ English ready")} className="w-10 h-10 rounded-full glass-strong flex items-center justify-center" aria-label="Translate"><Languages className="w-4 h-4" /></button>
            <button onClick={() => setShowSettings(s => !s)} className="w-10 h-10 rounded-full glass-strong flex items-center justify-center" aria-label="Settings"><Settings className="w-4 h-4" /></button>
          </div>

          <div className={`flex-1 flex ${theater ? "flex-col" : "lg:flex-row flex-col"} overflow-hidden`}>
            {/* video stage */}
            <div className={`relative ${theater ? "w-full flex-1" : "lg:flex-1 w-full aspect-video lg:aspect-auto"} bg-black flex items-center justify-center group`}
              onClick={() => setPlaying(p => !p)}>
              <motion.img key={i} src={cover} alt="" initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/50" />

              {!playing && (
                <button className="relative z-10 w-20 h-20 rounded-full bg-gradient-hero shadow-float flex items-center justify-center" aria-label="Play">
                  <Play className="w-9 h-9 ml-1 text-primary-foreground" fill="currentColor" />
                </button>
              )}

              {captions && (
                <div className="absolute bottom-24 inset-x-0 flex justify-center px-6 pointer-events-none">
                  <span className="text-sm md:text-base bg-black/60 backdrop-blur px-3 py-1.5 rounded">{r.caption}</span>
                </div>
              )}

              {/* controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent" onClick={e => e.stopPropagation()}>
                <div className="relative h-1.5 rounded-full bg-white/15 mb-3 cursor-pointer" onClick={e => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}>
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-gold" style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cream shadow-float" style={{ left: `calc(${progress}% - 6px)` }} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button onClick={() => setPlaying(p => !p)} className="w-9 h-9 rounded-full glass-strong flex items-center justify-center">
                    {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setMuted(m => !m)} className="w-9 h-9 rounded-full glass-strong flex items-center justify-center">
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-xs opacity-80">{Math.floor(progress * 0.06)}:{String(Math.floor(progress * 0.36) % 60).padStart(2, "0")} / 6:00</span>
                  <div className="flex-1" />
                  <button onClick={() => toast("Clip exported · 15s")} className="hidden sm:flex items-center gap-1 text-xs glass-strong px-3 py-1.5 rounded-full">
                    <Scissors className="w-3.5 h-3.5" /> Clip
                  </button>
                  <button onClick={() => setTheater(t => !t)} className="w-9 h-9 rounded-full glass-strong flex items-center justify-center" aria-label="Theater">
                    {theater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* quality settings popover */}
              {showSettings && (
                <div className="absolute top-16 right-3 z-30 glass-strong rounded-2xl p-2 min-w-[180px] text-foreground" onClick={e => e.stopPropagation()}>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-1">Quality</div>
                  {(["Auto", "1080p", "4K"] as const).map(q => (
                    <button key={q} onClick={() => { setQuality(q); setShowSettings(false); }}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${quality === q ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}>{q}</button>
                  ))}
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-2">Speed</div>
                  <div className="flex gap-1 px-2 pb-1">
                    {["0.5x", "1x", "1.5x", "2x"].map(s => <button key={s} className="text-xs px-2 py-1 rounded-md glass">{s}</button>)}
                  </div>
                </div>
              )}
            </div>

            {/* side rail */}
            <aside className={`${theater ? "border-t border-white/10" : "lg:w-[380px] lg:border-l lg:border-white/10"} overflow-y-auto p-4 space-y-4 bg-charcoal/95`}>
              <div>
                <h2 className="font-display text-xl leading-tight">{r.caption}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.creator}</div>
                    <div className="text-[11px] opacity-70">1.2M followers · {r.music}</div>
                  </div>
                  <button onClick={() => setSubscribed(s => !s)}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 ${subscribed ? "glass-strong" : "bg-gradient-hero text-primary-foreground"}`}>
                    <Bell className="w-3.5 h-3.5" /> {subscribed ? "Following" : "Follow"}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Pill icon={ThumbsUp} label={r.likes} />
                  <Pill icon={ThumbsDown} label="" />
                  <Pill icon={Share2} label="Share" onClick={() => toast("Share sheet opened")} />
                  <Pill icon={Bookmark} label="Save" onClick={() => toast("Saved to Watch Later")} />
                  <Pill icon={Gift} label="Tip" onClick={() => toast("Tip jar opened · Cirkel Pay")} />
                  <Pill icon={Sparkles} label="AI summary" onClick={() => toast.success("Summary", { description: "Cinematic walk through AlUla at golden hour with ambient Sahara score." })} />
                </div>

                <div className="mt-4 glass-strong rounded-2xl p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-secondary"><Sparkles className="w-3.5 h-3.5" /> AI Chapters</div>
                  <ul className="mt-2 space-y-1.5">
                    {["00:00 · Opening dunes", "01:12 · Old town", "03:40 · Sunset ridge", "05:20 · Lantern finale"].map(c => (
                      <li key={c}><button className="text-left hover:text-secondary">{c}</button></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-70 mb-2"><ListVideo className="w-3.5 h-3.5" /> Up next</div>
                <div className="space-y-2">
                  {reels.map((x, idx) => idx !== i && (
                    <button key={x.id} onClick={() => setI(idx)} className="w-full flex gap-3 text-left hover:bg-white/5 p-2 rounded-xl">
                      <div className="w-28 aspect-video rounded-lg overflow-hidden shrink-0 relative">
                        <img src={SCENES[(idx + 3) % SCENES.length]} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 px-1 rounded">6:00</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm line-clamp-2">{x.caption}</div>
                        <div className="text-[11px] opacity-60 mt-0.5">{x.creator} · {x.likes} views</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest opacity-70 mb-2 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5" /> 2.1K comments</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero" />
                  <input placeholder="Add a comment…" className="flex-1 glass rounded-full px-3 py-2 text-sm outline-none text-foreground" />
                </div>
                {[
                  { u: "@noura", t: "Cinema-grade. The 3:40 ridge shot is unreal." },
                  { u: "@majidf", t: "Need the gear list — what stabilizer?" },
                  { u: "@layla", t: "Saved for our AlUla trip ✨" },
                ].map(c => (
                  <div key={c.u} className="flex gap-2 py-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-mesh shrink-0" />
                    <div><div className="text-xs font-medium">{c.u}</div><div className="text-sm opacity-90">{c.t}</div></div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Pill({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="glass-strong text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />{label && <span>{label}</span>}
    </button>
  );
}
