const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Noto Sans SC", ...defaultTheme.fontFamily.sans],
      serif: ["Noto Serif SC", ...defaultTheme.fontFamily.serif],
      mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: "class",
};
