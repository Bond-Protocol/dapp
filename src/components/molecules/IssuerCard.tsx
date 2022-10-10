import { FC, useEffect, useState } from "react";
import { Protocol, PROTOCOL_NAMES } from "@bond-protocol/bond-library";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useBondPurchases } from "hooks/useBondPurchases";

type IssuerCardProps = {
  issuer: Protocol;
  markets: CalculatedMarket[];
};

export const IssuerCard: FC<IssuerCardProps> = ({ issuer, markets }) => {
  const navigate = useNavigate();
  const { tbvByProtocol } = useBondPurchases();

  const [tbv, setTbv] = useState(0);

  useEffect(() => {
    setTbv(tbvByProtocol.get(issuer.name as PROTOCOL_NAMES) || 0);
  }, [tbvByProtocol]);
  const handleClick = (name: string) => navigate("/issuers/" + name);

  const logo = issuer?.logoUrl || "/placeholders/token-placeholder.png";

  return (
    <div
      className="border border-transparent rounded-lg bg-white/[.05] p-5 flex flex-col justify-between items-center hover:cursor-pointer hover:bg-white/10"
      onClick={() => handleClick(issuer.id)}
    >
      <img className="h-[64px] w-[64px]" src={logo} />
      <p className="my-2 font-bold tracking-wide text-center">{issuer.name}</p>
      <p className="text-xs text-light-primary-50">{markets.length} Markets</p>
      <p className="text-[10px] text-light-primary-300">
        TBV ${Math.floor(tbv)}
      </p>
    </div>
  );
};
