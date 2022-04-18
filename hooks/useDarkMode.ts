import { useEffect } from "react";
import { useDarkMode as dark } from "usehooks-ts";

const IS_SERVER = typeof window === "undefined";

const useDarkMode = () => {
  const { isDarkMode, toggle, enable, disable } = dark();

  useEffect(() => {
    const setLight = () => {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    };

    const setDark = () => {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    };

    if (!IS_SERVER) {
      isDarkMode ? setDark() : setLight();
    }
  }, [isDarkMode]);

  return { isDarkMode, toggle, enable, disable };
};

export { useDarkMode };
