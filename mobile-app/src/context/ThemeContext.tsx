import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
};

export const lightColors = {
  background: "#f3f4f6",
  card: "#ffffff",
  text: "#111827",
  subtext: "#6b7280",
  muted: "#9ca3af",
  border: "#e5e7eb",
  headerBg: "#0A66C2",
  tabBg: "#ffffff",
  rowBorder: "#f3f4f6",
  accent: "#0A66C2",
  notice: "#eff6ff",
  noticeText: "#3b82f6",
};

export const darkColors: typeof lightColors = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  subtext: "#94a3b8",
  muted: "#64748b",
  border: "#334155",
  headerBg: "#0f172a",
  tabBg: "#1e293b",
  rowBorder: "#334155",
  accent: "#3b9eff",
  notice: "#1e3a5f",
  noticeText: "#60a5fa",
};

const THEME_KEY = "@parklith_theme";
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";
  const colors = isDark ? darkColors : lightColors;

  // Load persisted theme on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === "dark" || saved === "light") setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    AsyncStorage.setItem(THEME_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
