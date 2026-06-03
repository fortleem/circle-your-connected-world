import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Locale = "en" | "ar";
type Contrast = "standard" | "high";

interface AppCtx {
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  toggleLocale: () => void;
  dir: "ltr" | "rtl";
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  contrast: Contrast;
  setContrast: (v: Contrast) => void;
  textScale: number; // 0.9 – 1.3
  setTextScale: (v: number) => void;
}

const Ctx = createContext<AppCtx | null>(null);

const ls = (k: string, fb: string) =>
  (typeof window !== "undefined" && localStorage.getItem(k)) || fb;

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (ls("circle-theme", "dark") as Theme));
  const [locale, setLocale] = useState<Locale>(() => (ls("circle-locale", "en") as Locale));
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => ls("circle-rm", "0") === "1");
  const [contrast, setContrast] = useState<Contrast>(() => (ls("circle-contrast", "standard") as Contrast));
  const [textScale, setTextScale] = useState<number>(() => parseFloat(ls("circle-text-scale", "1")));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("circle-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("circle-locale", locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
    localStorage.setItem("circle-rm", reducedMotion ? "1" : "0");
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.contrast = contrast;
    localStorage.setItem("circle-contrast", contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", String(textScale));
    localStorage.setItem("circle-text-scale", String(textScale));
  }, [textScale]);

  return (
    <Ctx.Provider
      value={{
        theme,
        toggleTheme: () => setTheme(t => (t === "dark" ? "light" : "dark")),
        locale,
        toggleLocale: () => setLocale(l => (l === "en" ? "ar" : "en")),
        dir: locale === "ar" ? "rtl" : "ltr",
        reducedMotion,
        setReducedMotion,
        contrast,
        setContrast,
        textScale,
        setTextScale,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
