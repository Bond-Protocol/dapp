import {
  Navbar,
  Values,
  WinWin,
  CardProps,
  Footer,
  Grid,
  Hero,
  LinkButton,
} from "./components";
import { InfoLabel, Button } from "ui";
import "./index.css";
import { TextBlock } from "components/TextBlock";
import { PROTOCOLS } from "@bond-protocol/bond-library";

const protocols = Array.from(PROTOCOLS.values()).filter(
  (p) => !p.links.twitter?.includes("bond_protocol")
);

const auditors = [
  { name: "Zellic", logoUrl: "/zellic.svg" },
  { name: "yAcademy", logoUrl: "/yacademy.png" },
];

const headConfig = {
  title: "Bond Protocol",
  description: "The next evolution of Bonding-As-A-Service",
  url: "bondprotocol.finance",
  twitterHandle: "@bond_protocol",
  image: "www.bondprotocol.finance/assets/logo-black.svg",
};

export default function Home() {
  return (
    <div className="relative">
      <div id="bg" className="bg-base w-full">
        <div
          id="grad-1"
          className="bg-base lg:bg-grad-top-2 fml:block hidden"
        />
        <div id="grad-2" className="bg-base bg-grad-top-xs" />
        <div id="grad-2" className="bg-base bg-grad-mid-xs" />
        <div id="grad-3" className="bg-base bg-grad-bottom-r" />
        <div id="grad-4" className="bg-base bg-grad-bottom-l" />
      </div>
      <main>
        <Navbar />
        <div className="child:px-4 fml:max-w-[1440px] mx-auto max-w-[400px] font-sans antialiased lg:pt-10">
          <Hero className="fml:py-8 p-4 lg:py-12" />
          <div className="fml:max-w-[1136px] mx-auto lg:max-w-[1336px]">
            <div className="flex flex-wrap justify-center gap-4 py-4 lg:flex-nowrap">
              <div className="w-full grow lg:w-1/3 lg:grow-0">
                <InfoLabel label="Total Value Bonded">
                  $16M<span className="text-[32px]">+</span>
                </InfoLabel>
              </div>
              <div className="grow lg:w-1/3">
                <InfoLabel label="Bonds Issued">
                  600<span className="text-[32px]">+</span>
                </InfoLabel>
              </div>
              <div className="grow lg:w-1/3">
                <InfoLabel label="Bonds Markets">
                  15<span className="text-[32px]">+</span>
                </InfoLabel>
              </div>
            </div>

            <Values className="pb-24" />
            <WinWin />
            <div className="fml:flex gap-x-8 px-2 pt-14 lg:pt-24">
              <div className="fml:w-1/2">
                <div className="font-fraktion fml:font-bold fml:text-4xl max-w-[90%] py-6 text-[25px] uppercase leading-none">
                  {"The problem with existing yield farms"}
                </div>
                <InfoLabel label="Initial LPers Left after 72h">30%</InfoLabel>
              </div>
              <div className="fml:grid-cols-2 grid gap-y-4 pt-6 lg:w-1/2 lg:gap-x-6">
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
            <div className="mx-auto flex w-full justify-center gap-2 pt-10 lg:max-w-[400px]">
              <LinkButton
                size="lg"
                variant="ghost"
                thin={false}
                className="w-full"
              >
                {"Why Bond?"}
              </LinkButton>
              <LinkButton size="lg" thin={false} className="w-full">
                {"Discuss"}
              </LinkButton>
            </div>
            <div className="pt-32">
              <Grid
                title="Partners"
                description="Solidifying their treasuries with Bond Protocol"
                gridClassName="grid-cols-2 lg:grid-cols-5"
                content={protocols as CardProps[]}
              />
              <div className="mx-auto pt-20 lg:max-w-[250px]">
                <a href="https://docs.bondprotocol.finance" target="_blank">
                  <Button size="lg" variant="ghost" className="w-full">
                    Become A Partner
                  </Button>
                </a>
              </div>
            </div>
            <div className="pt-20 lg:pt-32">
              <Grid
                title="Audited By"
                gridClassName="grid-cols-2"
                content={auditors as CardProps[]}
              />
              <div className="mx-auto pt-8 lg:max-w-[250px]">
                <a
                  href="https://github.com/Bond-Protocol/bonds/tree/master/audits"
                  target="_blank"
                >
                  <Button size="lg" variant="ghost" className="w-full">
                    View Audits
                  </Button>
                </a>
              </div>
            </div>
            <div className="pt-20 lg:py-20 lg:pt-32">
              <div className="font-fraktion text-center text-5xl font-bold uppercase">
                {"Check the Bond Marketplace"}
              </div>
              <div className="mx-auto max-w-[250px] py-10">
                <a href="https://app.bondprotocol.finance" target="_blank">
                  <Button size="lg" className="w-full">
                    Launch dapp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
