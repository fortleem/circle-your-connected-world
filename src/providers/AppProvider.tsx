import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Locale = "en" | "ar";

interface AppCtx {
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  toggleLocale: () => void;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (typeof window !== "undefined" && localStorage.getItem("circle-theme") as Theme) || "dark");
  const [locale, setLocale] = useState<Locale>(() => (typeof window !== "undefined" && localStorage.getItem("circle-locale") as Locale) || "en");

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

  return (
    <Ctx.Provider
      value={{
        theme,
        toggleTheme: () => setTheme(t => (t === "dark" ? "light" : "dark")),
        locale,
        toggleLocale: () => setLocale(l => (l === "en" ? "ar" : "en")),
        dir: locale === "ar" ? "rtl" : "ltr",
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
