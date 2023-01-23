import { LinkButton } from "./LinkButton";
import Image from "next/image";
import data from "../data";

export type InfoLabelProps = {
  title: string;
  tooltip?: string;
  content: React.ReactNode;
  className?: string;
};

const content = [
  { title: "Better Price", content: "Opportunity to buy discounted tokens" },
  {
    title: "Permanent Liquidity",
    content: "Own liquidity and earn trading fees",
  },
  { title: "Vested Tokens", content: "Long-term alignment with protocol" },
  {
    title: "Diversified Treasury",
    content: "Acquire strategic assets",
  },
];

export const InvertedInfoLabel = (props: InfoLabelProps) => {
  return (
    <div
      className={`flex h-[120px] w-full flex-col justify-evenly overflow-hidden bg-white/[.05] text-center backdrop-blur-lg lg:items-center ${props.className}`}
    >
      <div className="flex justify-center uppercase">
        <div className="max-w-[64%] select-none text-center font-mono font-bold md:max-w-[50%] md:text-[25px] lg:max-w-full">
          {props.title}
        </div>
      </div>
      <p className="text-light-primary-500 font-regular mx-auto max-w-[90%] select-none font-sans text-[14px] leading-none md:text-base">
        {props.content}
      </p>
    </div>
  );
};

export const WinWinGrid = () => {
  return (
    <div className="mx-auto grid grid-cols-2 gap-y-[100px] gap-x-4 lg:gap-x-[370px] lg:gap-y-12">
      {content.map((c, i) => (
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
      <div className="text-grey-500 pt-2 pb-8 text-center">
        {"Bond protocol allows all parties to win and create stronger products"}
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
      </div>
      <div className="bp-btn-group bp-btn-lg">
        <LinkButton href={`${data.links.dapp}/#/markets`} variant="ghost">
          {"View Bonds"}
        </LinkButton>
        <LinkButton href={`${data.links.dapp}/#/create`}>
          {"Issue Bonds"}
        </LinkButton>
      </div>
    </div>
  );
};
