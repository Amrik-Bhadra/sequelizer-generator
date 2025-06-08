import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const htmlEle = window.document.documentElement;

    const applyTheme = (mode) => {
      htmlEle.classList.remove("light", "dark");
      if (mode === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        htmlEle.classList.add(isSystemDark ? "dark" : "light");
      } else {
        htmlEle.classList.add(mode);
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
