import { AnimatePresence, motion } from "framer-motion";
import { Activity, Heart, Sparkles, Waves, Wind, X, Music2, Cloud, Sun, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface Props { open: boolean; onClose: () => void; }

// Out-of-the-box: a real-time "digital biome" of a city — mood, soundscape,
// air, sentiment, energy — computed on-device from anonymized signals.
const CITIES = [
  { name: "Riyadh", mood: 78, energy: 82, calm: 64, sound: "Lo-fi · Boulevard", weather: "Clear · 28°", air: "Moderate", color: "from-secondary/40 to-accent/20", tag: "Festive" },
  { name: "Jeddah", mood: 71, energy: 68, calm: 80, sound: "Ambient · Corniche", weather: "Humid · 32°", air: "Good", color: "from-primary/40 to-secondary/20", tag: "Relaxed" },
  { name: "AlUla",  mood: 88, energy: 60, calm: 92, sound: "Wind · Desert", weather: "Dry · 26°", air: "Pristine", color: "from-accent/40 to-secondary/20", tag: "Wondrous" },
  { name: "NEOM",   mood: 74, energy: 91, calm: 55, sound: "Synthwave · Bay", weather: "Cool · 22°", air: "Good", color: "from-primary/40 to-accent/20", tag: "Electric" },
];

export function CirclePulse({ open, onClose }: Props) {
  const [city, setCity] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!open) return;
    const i = setInterval(() => setTick(t => t + 1), 1600);
    return () => clearInterval(i);
  }, [open]);

  const c = CITIES[city];
  const wave = (offset: number) => 50 + Math.sin((tick + offset) * 0.6) * 30;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-charcoal/60 backdrop-blur-md flex items-end sm:items-center justify-center p-3"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl glass-strong rounded-3xl overflow-hidden shadow-float"
          >
            <div className="relative p-5 pb-4">
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-60`} />
              <div className="absolute inset-0 aurora-bg opacity-40" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-secondary flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Circle Pulse · Live city biome
                  </div>
                  <h2 className="font-display text-3xl mt-1">{c.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Anonymous signals from {1240 + tick * 3} nearby devices · updated just now
                  </p>
                </div>
                <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* City switcher */}
              <div className="relative mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
                {CITIES.map((ct, i) => (
                  <button key={ct.name} onClick={() => setCity(i)}
                    className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition ${i === city ? "bg-primary text-primary-foreground" : "glass"}`}>
                    {ct.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Biosignal wave */}
            <div className="px-5">
              <div className="rounded-2xl bg-muted/40 p-4 relative overflow-hidden h-32">
                <div className="absolute inset-0 flex items-end gap-1 p-3">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: `${wave(i)}%` }}
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                      className="flex-1 rounded-full bg-gradient-to-t from-primary via-secondary to-accent opacity-80"
                    />
                  ))}
                </div>
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-foreground/80 flex items-center gap-1">
                  <Waves className="w-3 h-3" /> Collective rhythm
                </div>
                <div className="absolute top-3 right-3 glass text-[10px] px-2 py-0.5 rounded-full">{c.tag}</div>
              </div>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-3 gap-2 px-5 mt-3">
              <Vital icon={Heart}   label="Mood"   value={c.mood}   suffix="/100" />
              <Vital icon={Sparkles} label="Energy" value={c.energy} suffix="/100" />
              <Vital icon={Wind}     label="Calm"   value={c.calm}   suffix="/100" />
            </div>

            {/* Strips */}
            <div className="px-5 mt-3 space-y-2">
              <Strip icon={Music2} label="Soundscape" value={c.sound} />
              <Strip icon={Sun} label="Weather" value={c.weather} />
              <Strip icon={Cloud} label="Air quality" value={c.air} />
              <Strip icon={AlertTriangle} label="Safety" value="No active advisories · all clear" />
            </div>

            <div className="p-5 pt-4 flex items-center gap-2">
              <button className="flex-1 px-4 py-2.5 rounded-full bg-gradient-hero text-primary-foreground text-sm font-medium">
                Tune in to {c.name}
              </button>
              <button
                onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("circle:composer", { detail: { kind: "post", draft: `Sharing the pulse of ${c.name} right now — ${c.tag.toLowerCase()} vibes.` } })); }}
                className="px-4 py-2.5 rounded-full glass text-sm">
                Share pulse
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Vital({ icon: Icon, label, value, suffix }: any) {
  return (
    <div className="rounded-2xl glass p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="w-3 h-3 text-secondary" /> {label}
      </div>
      <div className="font-display text-2xl mt-0.5">{value}<span className="text-xs text-muted-foreground ms-0.5">{suffix}</span></div>
      <div className="h-1 mt-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-hero" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
function Strip({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl glass px-3 py-2 text-sm">
      <Icon className="w-4 h-4 text-secondary" />
      <span className="text-muted-foreground text-xs uppercase tracking-widest w-24">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
