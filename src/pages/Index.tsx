import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Splash } from "@/components/Splash";
import { Onboarding } from "@/components/Onboarding";
import { Dock } from "@/components/shell/Dock";
import { TopBar } from "@/components/shell/TopBar";
import { AIOrb } from "@/components/shell/AIOrb";
import { AIAssistant, type AIAction } from "@/components/AIAssistant";
import { CommandPalette } from "@/components/CommandPalette";
import { SettingsPanel } from "@/components/SettingsPanel";
import { GovernanceCenter } from "@/components/GovernanceCenter";
import { Composer } from "@/components/Composer";
import { TabId } from "@/lib/tabs";
import { HomeScreen } from "@/screens/HomeScreen";
import { WaslScreen } from "@/screens/WaslScreen";
import { MashahdScreen } from "@/screens/MashahdScreen";
import { LamahatScreen } from "@/screens/LamahatScreen";
import { MidanScreen } from "@/screens/MidanScreen";
import { RihlaScreen } from "@/screens/RihlaScreen";
import { PayScreen } from "@/screens/PayScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { toast } from "sonner";

const screens: Record<TabId, () => JSX.Element> = {
  home: HomeScreen, wasl: WaslScreen, mashahd: MashahdScreen, lamahat: LamahatScreen,
  midan: MidanScreen, rihla: RihlaScreen, pay: PayScreen, profile: ProfileScreen,
};

const titles: Record<TabId, string | undefined> = {
  home: undefined, wasl: "Wasl", mashahd: "Mashahd", lamahat: "Lamahat",
  midan: "Midan", rihla: "Rihla", pay: "Circle Pay", profile: "You",
};

// global event bus for cross-screen overlays
export const overlayEvent = (name: "composer" | "governance" | "settings" | "ai", detail?: any) =>
  window.dispatchEvent(new CustomEvent(`circle:${name}`, { detail }));

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("circle-onboarded");
  });
  const [tab, setTab] = useState<TabId>("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [composer, setComposer] = useState<{ open: boolean; kind?: "post" | "poll" | "media"; draft?: string }>({ open: false });
  const Screen = screens[tab];

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false); setAiOpen(false); setSettingsOpen(false);
        setGovernanceOpen(false); setComposer({ open: false });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onComposer = (e: any) => setComposer({ open: true, ...(e.detail || {}) });
    const onGovernance = () => setGovernanceOpen(true);
    const onSettings = () => setSettingsOpen(true);
    const onAi = () => setAiOpen(true);
    window.addEventListener("circle:composer", onComposer);
    window.addEventListener("circle:governance", onGovernance);
    window.addEventListener("circle:settings", onSettings);
    window.addEventListener("circle:ai", onAi);
    return () => {
      window.removeEventListener("circle:composer", onComposer);
      window.removeEventListener("circle:governance", onGovernance);
      window.removeEventListener("circle:settings", onSettings);
      window.removeEventListener("circle:ai", onAi);
    };
  }, []);

  const handleAIAction = (a: AIAction) => {
    if (a.type === "open-composer") setComposer({ open: true, kind: a.kind, draft: a.draft });
    else if (a.type === "open-governance") setGovernanceOpen(true);
    else if (a.type === "navigate") setTab(a.tab as TabId);
    else if (a.type === "scan-pay") { setTab("pay"); toast("Scan & Pay ready"); }
    else if (a.type === "toggle-ghost") toast.success("Ghost mode toggled");
  };

  const finishOnboarding = () => {
    localStorage.setItem("circle-onboarded", "1");
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 -z-10 aurora-bg opacity-40 pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-[60vh] -z-10 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        <TopBar
          title={titles[tab]}
          onSearch={() => setPaletteOpen(true)}
          onSettings={() => setSettingsOpen(true)}
        />
        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4"
          >
            <Screen />
          </motion.main>
        </AnimatePresence>
      </div>

      <AIOrb onClick={() => setAiOpen(true)} />
      <Dock active={tab} onChange={setTab} />

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} onAction={handleAIAction} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GovernanceCenter open={governanceOpen} onClose={() => setGovernanceOpen(false)} />
      <Composer
        open={composer.open}
        initialKind={composer.kind}
        initialText={composer.draft}
        onClose={() => setComposer({ open: false })}
      />

      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>
      <AnimatePresence>
        {!showSplash && showOnboarding && <Onboarding onDone={finishOnboarding} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
