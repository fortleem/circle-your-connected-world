import { AnimatePresence, motion } from "framer-motion";
import { X, Scale, ShieldCheck, Vote, CheckCircle2, Clock, FileText } from "lucide-react";
import { proposals } from "@/lib/mock";
import { useState } from "react";
import { toast } from "sonner";

type Vote = "yes" | "no" | "abstain";

export function GovernanceCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [filter, setFilter] = useState<"all" | "voting" | "passed" | "draft">("all");

  const list = proposals.filter(p => filter === "all" || p.status === filter);

  const cast = (id: string, v: Vote) => {
    setVotes(s => ({ ...s, [id]: v }));
    toast.success(`Vote recorded · ${v.toUpperCase()}`, {
      description: "Your vote is signed on-device and broadcast to the Circle quorum.",
    });
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
            className="fixed bottom-0 inset-x-0 z-[90] max-h-[92vh] rounded-t-[28px] glass-strong shadow-float overflow-hidden flex flex-col"
            role="dialog" aria-label="Governance center"
          >
            <div className="flex justify-center pt-2"><span className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>

            <div className="px-5 pt-3 pb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl leading-tight">Governance Center</h2>
                <div className="text-[11px] text-secondary flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Transparent · One Cirkel ID, one vote
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-muted/60 flex items-center justify-center" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 flex gap-2 overflow-x-auto scrollbar-hide pb-3">
              {(["all", "voting", "passed", "draft"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap capitalize ${filter === f ? "bg-primary text-primary-foreground" : "glass"}`}>
                  {f}
                </button>
              ))}
            </div>

            <ul className="flex-1 overflow-y-auto px-5 pb-[env(safe-area-inset-bottom)] pb-6 space-y-3">
              {list.map((p, i) => {
                const total = p.yes + p.no + p.abstain || 1;
                const yesPct = (p.yes / total) * 100;
                const noPct = (p.no / total) * 100;
                const userVote = votes[p.id];
                return (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="rounded-3xl border border-border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <StatusPill status={p.status} />
                          {p.tags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                          ))}
                        </div>
                        <h3 className="font-display text-lg leading-tight mt-2">{p.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{p.summary}</p>
                        <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-2">
                          <FileText className="w-3 h-3" /> {p.author}
                          <span>·</span>
                          <Clock className="w-3 h-3" /> {p.closesIn}
                        </div>
                      </div>
                    </div>

                    {/* Vote bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${yesPct}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="bg-primary h-full" />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${noPct}%` }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-accent h-full" />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Yes {p.yes.toLocaleString()}</span>
                        <span>No {p.no.toLocaleString()}</span>
                        <span>Abstain {p.abstain.toLocaleString()}</span>
                      </div>
                    </div>

                    {p.status === "voting" ? (
                      <div className="grid grid-cols-3 gap-2">
                        {(["yes", "no", "abstain"] as Vote[]).map(v => (
                          <button key={v} onClick={() => cast(p.id, v)}
                            className={`text-xs py-2 rounded-xl capitalize transition border ${
                              userVote === v
                                ? "bg-primary text-primary-foreground border-primary"
                                : "glass border-transparent hover:border-secondary/40"
                            }`}>
                            <Vote className="w-3 h-3 inline me-1" />{v}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] flex items-center gap-1.5 text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Decision recorded on the Circle ledger
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatusPill({ status }: { status: "voting" | "passed" | "draft" }) {
  const map = {
    voting: { c: "bg-secondary/20 text-secondary", l: "Voting open" },
    passed: { c: "bg-primary/20 text-primary", l: "Passed" },
    draft: { c: "bg-muted text-muted-foreground", l: "Draft" },
  } as const;
  const s = map[status];
  return <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${s.c}`}>{s.l}</span>;
}
