import { useState } from "react";
import { photos } from "@/lib/mock";
import { SCENES } from "@/lib/mockImages";
import { Sparkles, Layers, Heart, Plus, Grid3x3, Bookmark, Film, Camera } from "lucide-react";
import { LamahatViewer } from "@/components/LamahatViewer";
import { motion } from "framer-motion";

export function LamahatScreen() {
  const [viewer, setViewer] = useState<{ open: boolean; mode: "post" | "story"; index: number }>({ open: false, mode: "post", index: 0 });
  const [tab, setTab] = useState<"feed" | "reels" | "saved" | "tagged">("feed");

  return (
    <div className="pb-32">
      <div className="px-5 pt-2 flex items-center justify-between">
        <h1 className="font-display text-4xl">Lamahat</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "media" } }))}
            className="w-9 h-9 rounded-full glass flex items-center justify-center" aria-label="Create">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "media", draft: "📸 " } }))}
            className="text-xs px-3 py-1.5 rounded-full bg-gradient-gold text-brand-charcoal font-medium flex items-center gap-1">
            <Camera className="w-3 h-3" /> Capture
          </button>
        </div>
      </div>

      {/* Stories with add */}
      <div className="flex gap-3 px-5 mt-5 overflow-x-auto scrollbar-hide">
        <button onClick={() => window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "media" } }))}
          className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-secondary/60 flex items-center justify-center">
            <Plus className="w-6 h-6 text-secondary" />
          </div>
          <span className="text-[10px] text-muted-foreground">Your story</span>
        </button>
        {["Memories", "Travel", "Food", "Friends", "Sunsets", "Studio"].map((s, i) => (
          <button key={s} onClick={() => setViewer({ open: true, mode: "story", index: i })}
            className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-20 h-20 rounded-full p-[2px]" style={{ background: `conic-gradient(from ${i * 60}deg, hsl(var(--gold)), hsl(var(--rose)), hsl(var(--teal)))` }}>
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                <img src={SCENES[i % SCENES.length]} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{s}</span>
          </button>
        ))}
      </div>

      {/* AI memories banner */}
      <button onClick={() => setViewer({ open: true, mode: "story", index: 0 })}
        className="mx-5 mt-5 w-[calc(100%-2.5rem)] rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/15 to-transparent p-4 flex items-center gap-3 relative overflow-hidden text-left">
        <div className="absolute -top-12 -right-8 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center"><Sparkles className="w-5 h-5 text-brand-charcoal" /></div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-secondary">AI Memories</div>
          <div className="font-display text-lg">A year in golden hour</div>
          <div className="text-xs text-muted-foreground">42 photos · 8 places · Tap to relive</div>
        </div>
      </button>

      {/* Tabs */}
      <div className="mt-5 px-5 flex items-center gap-1 border-b border-border">
        {[
          { k: "feed", l: "Feed", i: Grid3x3 },
          { k: "reels", l: "Lamahat Reels", i: Film },
          { k: "saved", l: "Saved", i: Bookmark },
          { k: "tagged", l: "Tagged", i: Layers },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k as any)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 border-b-2 transition ${tab === t.k ? "border-secondary text-foreground" : "border-transparent text-muted-foreground"}`}>
            <t.i className="w-3.5 h-3.5" /> {t.l}
          </button>
        ))}
      </div>

      {/* Pinterest-style grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-2 px-2 mt-4">
        {photos.map((p, i) => (
          <motion.button key={p.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setViewer({ open: true, mode: "post", index: i })}
            className={`mb-2 break-inside-avoid rounded-xl relative overflow-hidden group block w-full ${
              p.ratio === "tall" ? "aspect-[3/4]" : p.ratio === "wide" ? "aspect-[4/3]" : "aspect-square"
            }`}
          >
            <img src={SCENES[i % SCENES.length]} alt="" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition text-xs" style={{ color: 'hsl(var(--cream))' }}>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-current" /> {(i + 1) * 124}</span>
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {i + 2}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <LamahatViewer open={viewer.open} mode={viewer.mode} index={viewer.index} onClose={() => setViewer(v => ({ ...v, open: false }))} />
    </div>
  );
}
