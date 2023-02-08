import { FC } from "react";

export type IssuerCardProps = {
  issuer: any;
  tbv: number;
  marketCount: number;
  navigate?: (to: string) => void;
};

export const IssuerCard: FC<IssuerCardProps> = ({
  issuer,
  tbv,
  marketCount,
  navigate,
}) => {
  const handleClick = (name: string) =>
    navigate && navigate("/issuers/" + name);

  const logo = issuer?.logoUrl || "/placeholders/token-placeholder.png";
  const _tbv = new Intl.NumberFormat("en-US").format(Math.floor(tbv));

  const marketSize =
    marketCount < 1
      ? "No Open Markets"
      : marketCount === 1
      ? `${marketCount} Market`
      : `${marketCount} Markets`;

  return (
    <div
      className="flex flex-col items-center justify-between rounded-lg border border-transparent bg-white/[.05] p-5 transition-all duration-300 hover:cursor-pointer hover:bg-white/10"
      onClick={() => handleClick(issuer.id)}
    >
      <div className="overflow-hidden rounded-full">
        <img className="h-[64px] w-[64px]" src={logo} />
      </div>
      <p className="my-2 text-center font-bold tracking-wide">
        {issuer.name + ""}
      </p>
      <p className="text-light-primary-50 text-xs font-bold">{marketSize}</p>
      <p className="text-light-primary-300 font-mono text-[10px]">
        TBV ${_tbv}
      </p>
    </div>
  );
};
