import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (mode) => {
      root.classList.remove("light", "dark");
      if (mode === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(isSystemDark ? "dark" : "light");
      } else {
        root.classList.add(mode);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
