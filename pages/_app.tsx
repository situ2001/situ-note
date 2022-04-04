import "../styles/globals.css";
import "@fontsource/noto-sans-mono";
import "@fontsource/noto-sans-sc";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
