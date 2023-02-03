import { LinkButton } from "./LinkButton";
import { TextBlock } from "./TextBlock";
import ArrowRight from "../assets/arrow-right.svg";
import data from "../data";

export const TheProblem = ({ className }: { className: string }) => {
  return (
    <div className={`mx-auto lg:px-0 ${className}`}>
      <div className="gap-x-8 px-2 lg:flex">
        <div className="lg:w-[38%]">
          <div className="font-fraktion mx-auto py-6 text-center text-5xl font-bold uppercase leading-none lg:text-left">
            The problem with
            <br className="hidden md:block" /> yield farming
          </div>
          <div className="font-fraktion mx-auto flex w-full justify-center gap-x-4 font-bold uppercase text-gray-400 lg:justify-start">
            <div className="p-4 backdrop-blur-lg">
              <span className="text-5xl font-bold text-white">50%</span>
              <br />
              of liquidity farmers
              <br /> exit within 15 days
            </div>
            <div className="p-4 backdrop-blur-lg">
              <span className="text-5xl font-bold text-white">70%</span>
              <br />
              of launch day liquidity
              <br />
              flees within 72hrs
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[370px] backdrop-blur-lg md:max-w-[469px] lg:mt-0 lg:w-1/2 lg:max-w-full">
          <div className="bp-arrow-row mx-auto">
            <TextBlock
              className="self-stretch justify-self-stretch"
              title="Sell Pressure"
              content="Tokens acquired from yield farms are likely to be sold by mercenary capital, destabilizing price."
            />
            <div className="self-center justify-self-center">
              <ArrowRight />
            </div>
            <TextBlock
              className="self-stretch justify-self-stretch"
              title="Price Volatility"
              content="Wild swings in token price cause instability for the protocol and negatively impact community members."
            />
          </div>

          <div className="flex w-full max-w-[370px] justify-around md:max-w-[469px] lg:max-w-full">
            <div className="self-center justify-self-center">
              <ArrowRight className="-rotate-90" />
            </div>

            <div className="self-center justify-self-center">
              <ArrowRight className="rotate-90" />
            </div>
          </div>

          <div className="bp-arrow-row">
            <TextBlock
              title="Fragile Liquidity"
              content={
                'Liquidity providers exit and sell their "yield" into thin liquidity, causing further sell pressure.'
              }
            />
            <div className="self-center justify-self-center">
              <ArrowRight class="rotate-180" />
            </div>
            <TextBlock
              title="Impermanent Loss"
              content="Token volatility exacerbates liquidity providers’ IL, capping upside and discouraging liquidity."
            />
          </div>
        </div>
      </div>
      <div className="bp-btn-group bp-btn-lg lg:pt-20">
        <LinkButton href={data.links.yieldArticle} size="lg" variant="ghost">
          Dig Deeper
        </LinkButton>
        <LinkButton href={data.links.dapp} size="lg">
          View Bonds
        </LinkButton>
      </div>
    </div>
  );
};
