import { FC } from "react";
import { Protocol } from "@bond-protocol/bond-library";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";

type IssuerCardProps = {
  issuer: Protocol;
  tbv: number;
  markets: CalculatedMarket[];
};

export const IssuerCard: FC<IssuerCardProps> = ({ issuer, tbv, markets }) => {
  const navigate = useNavigate();

  const handleClick = (name: string) => navigate("/issuers/" + name);

  const logo = issuer?.logoUrl || "/placeholders/token-placeholder.png";

  return (
    <div
      className="flex w-full flex-col items-center justify-between rounded-lg border border-transparent bg-white/[.05] p-5 hover:cursor-pointer hover:bg-white/10"
      onClick={() => handleClick(issuer.id)}
    >
      <img className="h-[64px] w-[64px]" src={logo} />
      <p className="font-jakarta my-2 text-center font-bold tracking-wide">
        {issuer.name + ""}
      </p>
      <p className="text-light-primary-50 text-xs">{markets.length} Markets</p>
      <p className="text-light-primary-300 text-[10px]">
        TBV ${Math.floor(tbv)}
      </p>
    </div>
  );
};
