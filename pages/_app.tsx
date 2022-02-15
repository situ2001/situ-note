import "../styles/globals.css";
import "@fontsource/roboto";
import "@fontsource/noto-sans-sc";
import type { AppProps } from "next/app";
import ProgressBar from "../components/ProgressBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ProgressBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
