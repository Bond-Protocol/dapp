import { useLayoutEffect, useRef, useState } from "react";
import { Navbar, Footer, Head } from "./";
import { GAContainer } from "../GAContainer";
import { Background } from "../Background";

const headConfig = {
  title: "Bond Protocol",
  description:
    "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace",
  url: "bondprotocol.finance",
  twitterHandle: "@bond_protocol",
  image: "https://bondprotocol.finance/logo-long.svg",
};

export default function Page(props: any) {
  const [pageHeight, setPageHeight] = useState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    //@ts-ignore
    const mainDiv = ref?.current?.getBoundingClientRect();
    setPageHeight(mainDiv.height);
  }, []);

  return (
    <>
      <Head {...headConfig} />
      <main className="h-full 2xl:max-w-2xl">
        <div className="mx-auto h-full w-full">
          <GAContainer />
          <Background height={pageHeight}>
            <Navbar />
            <div
              ref={ref}
              className="child:px-4 isolate mx-auto w-full max-w-[600px] pt-4 font-sans antialiased md:max-w-[1440px] md:pt-12 lg:max-w-[1600px] lg:pt-20"
            >
              {props.children}
            </div>
            <Footer />
          </Background>
        </div>
      </main>
    </>
  );
}
