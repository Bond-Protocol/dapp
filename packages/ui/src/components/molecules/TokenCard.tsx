import { FC } from "react";
import { TooltipWrapper } from "src/components";
import { CHAINS } from "types";

export type TokenCardProps = {
  token: any;
  navigate?: (to: string) => void;
};

export const TokenCard: FC<TokenCardProps> = ({ token, navigate }) => {
  const handleClick = () =>
    navigate && navigate("/tokens/" + token.chainId + "/" + token.address);

  const formattedTbv =
    token.tbv === 0 && token.purchaseCount > 0
      ? "Unknown"
      : "$" + new Intl.NumberFormat("en-US").format(Math.floor(token.tbv));

  const marketCount = token.markets.length;
  const noMarkets = marketCount == 0;

  const marketSize = noMarkets
    ? "No Open Markets"
    : marketCount === 1
    ? `${marketCount} Market`
    : `${marketCount} Markets`;

  const chainChip = CHAINS.get(token.chainId.toString())?.image;

  return (
    <div
      onClick={() => handleClick()}
      className="relative flex w-full cursor-pointer items-center rounded-lg border border-transparent bg-white/5 px-4 py-2 transition-all duration-300 hover:bg-white/10 md:flex-col md:px-0 md:py-5"
    >
      <div>
        <div className="absolute right-[6px] top-[6px]">
          <img className="h-[16px] w-[16px]" src={chainChip} />
        </div>

        <div className="overflow-hidden rounded-full border border-transparent">
          <img className="h-[64px] w-[64px]" src={token.logoURI} />
        </div>
      </div>
      <div className="ml-2 flex flex-col justify-center md:ml-0 md:items-center">
        {token.name.length <= 18 ? (
          <p className="text-left font-bold tracking-wide md:my-2 md:text-center">
            {token.name}
          </p>
        ) : (
          <TooltipWrapper content={token.name}>
            <p className="text-left font-bold tracking-wide md:my-2 md:text-center">
              {token.name.substring(0, 16).concat("\u2026")}
            </p>
          </TooltipWrapper>
        )}
        <p className="text-light-primary-300 font-mono text-[10px]">
          TBV {formattedTbv}
        </p>
        <p
          className={`text-[10px] font-bold md:text-xs ${
            noMarkets ? "text-light-grey-400/50" : "text-light-primary-50"
          }`}
        >
          {marketSize}
        </p>
      </div>
    </div>
  );
};
