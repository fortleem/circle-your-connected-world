import { motion } from "framer-motion";
import { featured, nearby, trending } from "@/lib/mock";
import { useApp } from "@/providers/AppProvider";
import { dict } from "@/lib/i18n";
import { Sparkles, MapPin, TrendingUp, Briefcase, Zap, Plus, Mic, Camera, ScanLine } from "lucide-react";

const colorMap: Record<string, string> = {
  rose: "from-accent/30 to-accent/5 border-accent/30",
  gold: "from-secondary/30 to-secondary/5 border-secondary/40",
  teal: "from-primary/30 to-primary/5 border-primary/30",
  steel: "from-brand-steel/30 to-brand-steel/5 border-brand-steel/30",
};

export function HomeScreen() {
  const { locale } = useApp();
  const t = dict[locale].home;
  return (
    <div className="space-y-8 pb-32">
      {/* Greeting */}
      <section className="px-5 pt-2">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl leading-tight">
          {t.hello}, <span className="gradient-text-gold">Yousef</span>
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-1">Riyadh · 28°C · Clear skies</p>
      </section>

      {/* AI Ask bar */}
      <section className="px-5">
        <div className="glass rounded-full px-4 py-3 flex items-center gap-3 shadow-soft">
          <Sparkles className="w-4 h-4 text-secondary" />
          <input className="bg-transparent flex-1 outline-none text-sm placeholder:text-muted-foreground" placeholder={t.ask} />
          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Mic className="w-4 h-4" /></button>
        </div>
      </section>

      {/* Featured carousel */}
      <section>
        <SectionHeader icon={Zap} title={t.featured} />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2 snap-x snap-mandatory">
          {featured.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`snap-start shrink-0 w-[78%] sm:w-[60%] md:w-[40%] aspect-[4/5] rounded-2xl border bg-gradient-to-br ${colorMap[f.color]} p-5 relative overflow-hidden glass`}
            >
              <div className="absolute inset-0 aurora-bg opacity-60" />
              <div className="relative h-full flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.kind}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{f.subtitle}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ScanLine, label: "Scan & Pay" },
            { icon: Camera, label: "Story" },
            { icon: Plus, label: "Post" },
            { icon: Sparkles, label: "Ask AI" },
          ].map((q, i) => (
            <button key={i} className="glass rounded-2xl py-3 flex flex-col items-center gap-2 hover:scale-[1.03] transition shadow-soft">
              <q.icon className="w-5 h-5 text-secondary" />
              <span className="text-[11px] text-foreground/80">{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby */}
      <section>
        <SectionHeader icon={MapPin} title={t.nearby} />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2">
          {nearby.map(n => (
            <div key={n.id} className="shrink-0 w-56 rounded-2xl bg-gradient-card border border-border p-4 shadow-soft">
              <div className="aspect-video rounded-xl bg-gradient-mesh opacity-90 mb-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 glass text-[10px] px-2 py-0.5 rounded-full">{n.tag}</div>
              </div>
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* For you AI */}
      <section className="px-5">
        <SectionHeader icon={Sparkles} title={t.forYou} inline />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {[
            { t: "A 3-day getaway to AlUla", s: "Based on your wishlist · From SAR 1,840" },
            { t: "Weekly read: Calm tech", s: "12-min curated by Circle AI" },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent p-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
              <span className="text-[10px] uppercase tracking-widest text-secondary">AI Recommendation</span>
              <h4 className="font-display text-xl mt-1">{c.t}</h4>
              <p className="text-sm text-muted-foreground mt-1">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="px-5">
        <SectionHeader icon={TrendingUp} title={t.trending} inline />
        <div className="mt-3 glass rounded-2xl divide-y divide-border/60 overflow-hidden">
          {trending.map((tr, i) => (
            <div key={tr.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
                <span className="font-medium">{tr.tag}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tr.count} posts</span>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace */}
      <section className="px-5">
        <SectionHeader icon={Briefcase} title={t.workspace} inline />
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-display">D</div>
            <div className="flex-1">
              <div className="font-medium">Design Workspace</div>
              <div className="text-xs text-muted-foreground">3 updates · 12 unread messages</div>
            </div>
            <div className="flex -space-x-2">
              {["bg-secondary", "bg-accent", "bg-primary"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-background`} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, inline }: { icon: any; title: string; inline?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-5 ${inline ? "" : "mb-3"}`}>
      <Icon className="w-4 h-4 text-secondary" />
      <h2 className="font-display text-xl">{title}</h2>
    </div>
  );
}
