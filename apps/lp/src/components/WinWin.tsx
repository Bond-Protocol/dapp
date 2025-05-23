import { LinkButton, TextBlock } from "./common";
import Image from "next/image";
import data from "../data";

export type LabelProps = {
  title: string;
  tooltip?: string;
  content: React.ReactNode;
  className?: string;
};

const price = {
  title: "Better Price",
  content: "Bid for demand-based discounts",
};

const liquidity = {
  title: "Permanent Liquidity",
  content: "Stabilize market and earn trading fees",
};

const tokens = {
  title: "Vested Tokens",
  content: "Long-term alignment with protocol",
};

const treasury = {
  title: "Diversified Treasury",
  content: "Protect treasury value and extend runway",
};

const content = [price, liquidity, tokens, treasury];
const smolContent = [price, tokens, liquidity, treasury];

export const InvertedInfoLabel = (props: LabelProps) => {
  return (
    <div
      className={`flex h-[120px] w-full flex-col justify-evenly overflow-hidden bg-white/[.05] text-center backdrop-blur-lg lg:items-center ${props.className}`}
    >
      <div className="flex justify-center uppercase">
        <div className="max-w-[64%] select-none text-center font-mono font-bold md:max-w-[50%] md:text-[25px] lg:max-w-full">
          {props.title}
        </div>
      </div>
      <p className="font-regular mx-auto max-w-[90%] select-none font-sans text-[14px] leading-none text-gray-400 md:text-base">
        {props.content}
      </p>
    </div>
  );
};

export const WinWinGrid = () => {
  return (
    <div className="mx-auto hidden grid-cols-2 gap-y-[100px] gap-x-4 lg:grid lg:gap-x-[370px] lg:gap-y-12">
      {content.map((c, i) => (
        <InvertedInfoLabel {...c} key={i} />
      ))}
    </div>
  );
};

export const SmolWinWinGrid = () => {
  return (
    <div className="mx-auto grid grid-cols-2 gap-y-[100px] gap-x-4 lg:hidden lg:gap-x-[370px] lg:gap-y-12">
      {smolContent.map((c, i) => (
        <InvertedInfoLabel {...c} key={i} />
      ))}
    </div>
  );
};

export const WinWin = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      <div className="font-fraktion text-center text-5xl font-semibold uppercase">
        {"A Win-Win for All"}
      </div>
      <div className="text-grey-500 pt-2 text-center">
        {"Bonds builds stronger protocols with more resilient treasuries"}
      </div>
      <div className="flex w-full justify-center py-12 lg:justify-between">
        <TextBlock
          className="text-center lg:text-left"
          title="Community"
          content="Acquire discounted governance tokens"
        />
        <TextBlock
          className="hidden text-right lg:block"
          title="Protocol"
          content="Diversify treasury and own liquidity"
        />
      </div>
      <div className="relative">
        <div className="hidden lg:block">
          <Image alt="win-win-long" src="/winwin-long.svg" fill />
        </div>
        <div className="bp-absolute-center h-full w-full ">
          <Image
            alt="win-win"
            src="/winwin.svg"
            fill
            className="h-full w-full lg:hidden"
          />
        </div>
        <WinWinGrid />
        <SmolWinWinGrid />
      </div>
      <div className="mx-auto py-12 lg:hidden">
        <TextBlock
          className="text-center"
          title="Protocol"
          content="Diversify treasury and own liquidity"
        />
      </div>
      <div className="bp-btn-group bp-btn-lg">
        <LinkButton href={data.links.whyBond} variant="ghost">
          {"Why Bond"}
        </LinkButton>
        <LinkButton href={`${data.links.dapp}/#/create`}>
          {"Issue Bonds"}
        </LinkButton>
      </div>
    </div>
  );
};
