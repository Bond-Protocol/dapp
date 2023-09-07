import "../styles/index.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import BasePage from "../components/common/BasePage";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <BasePage>
        <Component {...pageProps} />
      </BasePage>
      <Analytics />
    </>
  );
}
