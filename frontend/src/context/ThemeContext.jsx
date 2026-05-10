import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const themes = {
  dark: {
    background: "#0a0a0a",
    card: "#161616",
    border: "#222222",
    text: "#ffffff",
    textSecondary: "#888888",
    textMuted: "#555555",
    accent: "#22c55e",
    accentHover: "#16a34a",
    inputBackground: "#161616",
    navbarBackground: "#111111",
    buttonBackground: "#1a1a1a",
    buttonText: "#bbbbbb",
  },

  light: {
    background: "#f8fafc",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    textSecondary: "#4b5563",
    textMuted: "#9ca3af",
    accent: "#16a34a",
    accentHover: "#22c55e",
    inputBackground: "#ffffff",
    navbarBackground: "#ffffff",
    buttonBackground: "#f3f4f6",
    buttonText: "#374151",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    // Terapkan warna global ke body
    const current = themes[theme];
    document.body.style.backgroundColor = current.background;
    document.body.style.color = current.text;
    document.body.style.margin = "0";
    document.body.style.fontFamily =
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
