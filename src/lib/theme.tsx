import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: "light" | "dark";
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "ejada_theme";

const getSystem = (): "light" | "dark" =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const apply = (resolved: "light" | "dark") => {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    theme === "system" ? getSystem() : theme,
  );

  useEffect(() => {
    const next = theme === "system" ? getSystem() : theme;
    setResolved(next);
    apply(next);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // React to OS changes when on "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = getSystem();
      setResolved(next);
      apply(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme: setThemeState, resolved }}>{children}</Ctx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
