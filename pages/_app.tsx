import "../styles/globals.css";
import "@fontsource/noto-sans-mono";
import "@fontsource/noto-sans-sc";
import "@fontsource/fira-code";

import type { AppProps } from "next/app";
import { useDarkMode } from "../hooks/useDarkMode";

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useDarkMode();
  return <Component {...pageProps} />;
}

export default MyApp;
