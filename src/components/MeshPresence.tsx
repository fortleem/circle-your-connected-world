import { motion, AnimatePresence } from "framer-motion";
import { Radio, Wifi, Users } from "lucide-react";
import { meshPeers, spaces } from "@/lib/mock";
import { useEffect, useState } from "react";

export function MeshPresence() {
  const [peers, setPeers] = useState(meshPeers);
  const [pulse, setPulse] = useState(0);

  // Simulate live presence: rotate the first peer to bottom every 3.5s
  useEffect(() => {
    const id = setInterval(() => {
      setPeers(p => [...p.slice(1), p[0]]);
      setPulse(x => x + 1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-5">
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="w-4 h-4 text-secondary" />
        <h2 className="font-display text-xl flex-1">Mesh presence</h2>
        <span className="text-[10px] uppercase tracking-widest text-secondary flex items-center gap-1">
          <motion.span
            key={pulse}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
          Live
        </span>
      </div>

      <div className="rounded-3xl glass overflow-hidden relative">
        {/* Radar visual */}
        <div className="relative h-36 overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 aurora-bg opacity-50" />
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.3, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-secondary/50"
            />
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-mesh flex items-center justify-center">
            <Radio className="w-4 h-4 text-primary-foreground" />
          </div>
          {/* Peer dots */}
          {peers.slice(0, 4).map((p, i) => {
            const angle = (i / 4) * Math.PI * 2 + pulse * 0.2;
            const r = 56 + (i % 2) * 12;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.div
                key={p.id}
                animate={{ x, y }}
                transition={{ type: "spring", damping: 24, stiffness: 80 }}
                className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-secondary shadow-glow"
              />
            );
          })}
          <div className="absolute bottom-2 left-3 text-[10px] flex items-center gap-1 text-secondary">
            <Users className="w-3 h-3" /> {peers.length} peers within 150m
          </div>
        </div>

        {/* Activity stream */}
        <ul className="divide-y divide-border/60">
          <AnimatePresence initial={false}>
            {peers.slice(0, 3).map(p => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="px-4 py-2.5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-mesh shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm"><span className="font-medium">{p.name}</span> <span className="text-muted-foreground">{p.action}</span></div>
                  <div className="text-[10px] text-muted-foreground">{p.distance} · mesh-relayed</div>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Synced spaces */}
        <div className="p-3 border-t border-border/60 bg-muted/20">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Spaces syncing in realtime</div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {spaces.map(s => (
              <motion.div key={s.id}
                whileHover={{ y: -2 }}
                className="shrink-0 rounded-2xl border border-secondary/30 bg-card px-3 py-2 flex items-center gap-2">
                <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-hero text-primary-foreground">
                  <Radio className="w-3 h-3" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-medium truncate max-w-[140px]">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground">{s.listeners.toLocaleString()} live</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
