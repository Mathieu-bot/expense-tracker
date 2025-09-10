import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  prefersDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";

  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }

  const initialFromHead = (window as unknown as { __INITIAL_THEME__?: Theme })
    .__INITIAL_THEME__;

  if (initialFromHead === "light" || initialFromHead === "dark") {
    return initialFromHead;
  }

  return "system";
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const [prefersDark, setPrefersDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  const applyToDocument = useCallback((t: Theme) => {
    if (typeof window === "undefined") return;

    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = t === "dark" || (t === "system" && systemDark);

    document.documentElement.setAttribute(
      "data-theme",
      shouldBeDark ? "dark" : "light"
    );
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      //
    }
    applyToDocument(theme);
  }, [theme, applyToDocument]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else {
      mql.addListener(handler);
    }

    setPrefersDark(mql.matches);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler);
      } else {
        mql.removeListener(handler);
      }
    };
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem("theme", newTheme);
      } catch {
        //
      }
      setThemeState(newTheme);
      applyToDocument(newTheme);
    },
    [applyToDocument]
  );

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme =
        prev === "system" ? "dark" : prev === "dark" ? "light" : "system";

      try {
        localStorage.setItem("theme", next);
      } catch {
        //
      }
      applyToDocument(next);
      return next;
    });
  }, [applyToDocument]);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleTheme, prefersDark }),
    [theme, isDark, setTheme, toggleTheme, prefersDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
