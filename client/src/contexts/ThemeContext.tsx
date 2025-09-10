import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
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
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  const initialFromHead = (window as unknown as { __INITIAL_THEME__?: Theme })
    .__INITIAL_THEME__;

  if (initialFromHead === "light" || initialFromHead === "dark") {
    return initialFromHead;
  }

  return "light";
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const isDark = theme === "dark";

  const applyToDocument = useCallback((t: Theme) => {
    if (typeof window === "undefined") return;

    const shouldBeDark = t === "dark";
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
      const next: Theme = prev === "dark" ? "light" : "dark";
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
    () => ({ theme, isDark, setTheme, toggleTheme }),
    [theme, isDark, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
