import { Html, Head, Main, NextScript } from "next/document";
import { Background } from "../components";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Background>
          <Main />
          <NextScript />
        </Background>
      </body>
    </Html>
  );
}
