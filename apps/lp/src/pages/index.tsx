import { useLayoutEffect, useRef, useState } from "react";
import { InfoLabel } from "ui";

import {
  Navbar,
  Values,
  WinWin,
  CardProps,
  Footer,
  Grid,
  Hero,
  LinkButton,
  TextBlock,
  Head,
  Background,
} from "../components";
import { TheProblem } from "../components/TheProblem";

import data from "../data";

const headConfig = {
  title: "Bond Protocol",
  description:
    "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace",
  url: "bondprotocol.finance",
  twitterHandle: "@bond_protocol",
  image: "https://bondprotocol.finance/logo-long.svg",
};

export default function Home() {
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
          <Background height={pageHeight}>
            <Navbar />
            <div
              ref={ref}
              className="child:px-4 isolate mx-auto w-full max-w-[600px] pt-4 font-sans antialiased md:max-w-[1440px] md:pt-12 lg:max-w-[1600px] lg:pt-20"
            >
              <Hero className="mt-[10vh] " />
              <Values className="mx-auto my-10 w-full px-4 lg:my-24 lg:px-16" />
              <TheProblem className="bp-container" />
              <WinWin className="bp-container" />
              <div className="bp-container">
                <Grid
                  title="Partners"
                  description="Solidifying their treasuries with Bond Protocol"
                  content={data.protocols as CardProps[]}
                />
                <div className="pt-20">
                  <LinkButton
                    href={data.links.verify}
                    size="lg"
                    variant="ghost"
                  >
                    Become a Partner
                  </LinkButton>
                </div>
              </div>
              <div className="bp-container">
                <Grid
                  big
                  title="Audited By"
                  className="w-full"
                  gridClassName="child:max-w-[360px] child:w-[360px] child:child:md:w-full"
                  content={data.auditors as CardProps[]}
                />
                <div className="pt-8">
                  <LinkButton href={data.links.audits} variant="ghost">
                    Study Audits
                  </LinkButton>
                </div>
                <Grid
                  big
                  title="Bug Bounties on"
                  className="mt-20"
                  content={data.bounties as CardProps[]}
                />
              </div>
              <div className="bp-container">
                <div className="font-fraktion text-center text-4xl font-bold uppercase md:text-5xl">
                  Find bonds in the marketplace
                </div>
                <div className="py-10">
                  <LinkButton href={data.links.markets}>
                    Browse the Bond Market
                  </LinkButton>
                </div>
              </div>
            </div>
            <Footer />
          </Background>
        </div>
      </main>
    </>
  );
}
