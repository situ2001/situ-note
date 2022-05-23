import "../styles/globals.css";
import "@fontsource/noto-sans-mono";
import "@fontsource/noto-sans-sc";
import "@fontsource/fira-code";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="data-theme">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
