import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export const TRACKING_ID = "G-EEHDXY4KZZ";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {" "}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
