import {
  Values,
  WinWin,
  CardProps,
  Grid,
  Hero,
  LinkButton,
} from "../components";
import { TheProblem } from "../components/TheProblem";

import data from "../data";

export default function Home() {
  return (
    <>
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
          <LinkButton target="_self" href="/hello" size="lg" variant="ghost">
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
    </>
  );
}
