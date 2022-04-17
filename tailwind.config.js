module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Noto Sans SC'],
      'serif': ['Noto Serif SC'],
      'mono': ['Noto Sans Mono'],
      'body': ['Noto Sans SC'],
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  }
}
