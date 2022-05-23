import { useTheme } from "next-themes";
import { useEffect } from "react";

export const useDarkMode = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (currentTheme === "dark") {
        document.documentElement.className = "dark";
      } else {
        document.documentElement.className = "light";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.className = "";
      }
    };
  }, [currentTheme]);

  return {
    currentTheme,
    setTheme,
  };
};
