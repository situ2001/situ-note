import Head from "next/head";
import "../styles/globals.css";
import "@fontsource/noto-sans-mono";
import "@fontsource/noto-sans-sc";
import "@fontsource/fira-code";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ThemeProvider enableSystem={true} attribute="data-theme">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
