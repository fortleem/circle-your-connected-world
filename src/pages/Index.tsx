import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Splash } from "@/components/Splash";
import { Onboarding } from "@/components/Onboarding";
import { Dock } from "@/components/shell/Dock";
import { TopBar } from "@/components/shell/TopBar";
import { AIOrb } from "@/components/shell/AIOrb";
import { TabId } from "@/lib/tabs";
import { HomeScreen } from "@/screens/HomeScreen";
import { WaslScreen } from "@/screens/WaslScreen";
import { MashahdScreen } from "@/screens/MashahdScreen";
import { LamahatScreen } from "@/screens/LamahatScreen";
import { MidanScreen } from "@/screens/MidanScreen";
import { RihlaScreen } from "@/screens/RihlaScreen";
import { PayScreen } from "@/screens/PayScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";

const screens: Record<TabId, () => JSX.Element> = {
  home: HomeScreen,
  wasl: WaslScreen,
  mashahd: MashahdScreen,
  lamahat: LamahatScreen,
  midan: MidanScreen,
  rihla: RihlaScreen,
  pay: PayScreen,
  profile: ProfileScreen,
};

const titles: Record<TabId, string | undefined> = {
  home: undefined,
  wasl: "Wasl", mashahd: "Mashahd", lamahat: "Lamahat",
  midan: "Midan", rihla: "Rihla", pay: "Circle Pay", profile: "Profile",
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("circle-onboarded");
  });
  const [tab, setTab] = useState<TabId>("home");
  const Screen = screens[tab];

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("circle-onboarded", "1");
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient aurora background */}
      <div className="fixed inset-0 -z-10 aurora-bg opacity-40 pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-[60vh] -z-10 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        <TopBar title={titles[tab]} />
        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4"
          >
            <Screen />
          </motion.main>
        </AnimatePresence>
      </div>

      <AIOrb />
      <Dock active={tab} onChange={setTab} />

      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>
      <AnimatePresence>
        {!showSplash && showOnboarding && <Onboarding onDone={finishOnboarding} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
