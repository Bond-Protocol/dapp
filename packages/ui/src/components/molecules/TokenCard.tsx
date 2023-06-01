import { FC } from "react";

export type TokenCardProps = {
  token: any;
  tbv: number;
  marketCount: number;
  navigate?: (to: string) => void;
};

export const TokenCard: FC<TokenCardProps> = ({
  token,
  tbv,
  marketCount = 0,
  navigate,
}) => {
  const handleClick = (name: string) =>
    navigate && navigate("/tokens/" + token.chainId + "/" + token.address);

  const formattedTbv = new Intl.NumberFormat("en-US").format(Math.floor(tbv));

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
      <p className="my-2 text-center font-bold tracking-wide">{token.name}</p>

      <p className="text-light-primary-300 font-mono text-[10px]">
        TBV ${formattedTbv}
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
