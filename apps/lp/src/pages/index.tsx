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

import data from "../data";

const headConfig = {
  title: "Bond Protocol",
  description:
    "Acquire assets, own liquidity and diversify your treasury on the permissionless bond marketplace",
  url: "bondprotocol.finance",
  twitterHandle: "@bond_protocol",
  image: "/logo.svg",
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
        <div className="h-full">
          <Background height={pageHeight}>
            <Navbar />
            <div
              ref={ref}
              className="child:px-4 isolate mx-auto max-w-[600px] pt-4 font-sans antialiased md:max-w-[1440px] md:pt-12 lg:pt-16 lg:max-w-[1600px]"
            >
              <Hero className="p-4 md:py-8 lg:py-12" />
              <div className="mx-auto w-full px-4 lg:px-16">
                <div className="flex flex-wrap justify-center gap-4 py-4 lg:flex-nowrap">
                  <div className="w-full grow lg:w-1/3 lg:grow-0">
                    <InfoLabel label="Total Value Bonded">
                      $20M<span className="text-[32px]">+</span>
                    </InfoLabel>
                  </div>
                  <div className="grow lg:w-1/3">
                    <InfoLabel label="Bonds Issued">
                      1K<span className="text-[32px]">+</span>
                    </InfoLabel>
                  </div>
                  <div className="grow lg:w-1/3">
                    <InfoLabel label="Bonds Markets">
                      20<span className="text-[32px]">+</span>
                    </InfoLabel>
                  </div>
                </div>

                <Values className="pb-24" />
                <WinWin />
                <div className="gap-x-8 px-2 pt-14 md:flex lg:pt-24">
                  <div className="md:w-1/2">
                    <div className="font-fraktion max-w-[90%] py-6 text-[25px] uppercase leading-none md:text-4xl md:font-bold">
                      {"The problem with existing yield farms"}
                    </div>
                    <InfoLabel label="Initial LPers Left after 72h">
                      30%
                    </InfoLabel>
                  </div>
                  <div className="grid gap-y-4 pt-6 md:grid-cols-2 lg:w-1/2 lg:gap-x-6">
                    <TextBlock
                      title="Sell Pressure"
                      content="Token prices are highly subject to sell pressure from the yield farming community, making price unstable."
                    />
                    <TextBlock
                      title="Transient Liquidity"
                      content="Liquidity in yield farms is highly transient and unreliable for the protocol."
                    />
                    <TextBlock
                      title="Impermanent Loss"
                      content="Due to the mechanics of yield farms, the upside when a token appreciates in value is capped due to impermanent loss."
                    />
                    <TextBlock
                      title="Price Volatility"
                      content="Volatile token prices negatively impact communities and cause instability for the protocol."
                    />
                  </div>
                </div>
                <div className="bp-btn-group bp-btn-lg">
                  <LinkButton
                    href={data.links.whyBond}
                    size="lg"
                    variant="ghost"
                  >
                    {"Why Bond?"}
                  </LinkButton>
                  <LinkButton href={data.links.dapp} size="lg">
                    {"Be a Bondor"}
                  </LinkButton>
                </div>
                <div className="pt-32">
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
                      {"Become a Partner"}
                    </LinkButton>
                  </div>
                </div>
                <div className="pt-20 lg:pt-32">
                  <Grid
                    big
                    title="Audited By"
                    gridClassName="child:max-w-[360px] child:w-[360px] child:child:md:w-full"
                    content={data.auditors as CardProps[]}
                  />
                  <div className="pt-8">
                    <LinkButton href={data.links.audits} variant="ghost">
                      {"Study Audits"}
                    </LinkButton>
                  </div>
                </div>
                <div className="pt-20 lg:pt-32">
                  <Grid
                    big
                    title="Bug Bounties on"
                    content={data.bounties as CardProps[]}
                  />
                </div>
                <div className="pt-20 lg:py-20 lg:pt-32">
                  <div className="font-fraktion text-center text-4xl font-bold uppercase md:text-5xl">
                    {"Find bonds in the marketplace"}
                  </div>
                  <div className="py-10">
                    <LinkButton href={data.links.dapp}>
                      {"Browse the Bond Market"}
                    </LinkButton>
                  </div>
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
