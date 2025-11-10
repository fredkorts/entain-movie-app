import { createContext, useCallback, useEffect, useMemo, useState } from "react";

type Mode = "light" | "dark";
type Ctx = { mode: Mode; toggle: () => void; set: (m: Mode) => void };

export const ThemeContext = createContext<Ctx>({ mode: "light", toggle: () => {}, set: () => {} });

export function useThemeInit(): Ctx {
  const prefDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const stored = (typeof window !== "undefined" && (localStorage.getItem("theme") as Mode | null)) || null;
  const [mode, setMode] = useState<Mode>(stored || (prefDark ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggle = useCallback(() => setMode(m => (m === "dark" ? "light" : "dark")), []);
  const set = useCallback((m: Mode) => setMode(m), []);

  return useMemo(() => ({ mode, toggle, set }), [mode, toggle, set]);
}
