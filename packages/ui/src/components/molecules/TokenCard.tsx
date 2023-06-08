import { FC } from "react";
import { TooltipWrapper } from "src/components";

export type TokenCardProps = {
  token: any;
  navigate?: (to: string) => void;
};

export const TokenCard: FC<TokenCardProps> = ({ token, navigate }) => {
  const handleClick = (name: string) =>
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

  return (
    <div
      className="flex flex-col items-center justify-between rounded-lg border border-transparent bg-white/[.05] p-5 transition-all duration-300 hover:cursor-pointer hover:bg-white/10"
      onClick={() => handleClick(token.id)}
    >
      <div className="overflow-hidden rounded-full">
        <img className="h-[64px] w-[64px]" src={token.logoUrl} />
      </div>
      {token.name.length <= 18 ? (
        <p className="my-2 text-center font-bold tracking-wide">{token.name}</p>
      ) : (
        <TooltipWrapper content={token.name}>
          <p className="my-2 text-center font-bold tracking-wide">
            {token.name.substring(0, 16).concat("\u2026")}
          </p>
        </TooltipWrapper>
      )}

      <p className="text-light-primary-300 font-mono text-[10px]">
        TBV {formattedTbv}
      </p>
      <p
        className={`text-xs font-bold ${
          noMarkets ? "text-light-grey-400/50" : "text-light-primary-50"
        }`}
      >
        {marketSize}
      </p>
    </div>
  );
};
