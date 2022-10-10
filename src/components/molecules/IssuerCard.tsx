import { FC, useEffect, useState } from "react";
import {Protocol, PROTOCOL_NAMES} from "@bond-protocol/bond-library";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import {useBondPurchases} from "hooks/useBondPurchases";

type IssuerCardProps = {
  issuer: Protocol;
  markets: CalculatedMarket[];
};

const splitCamelCaseText = (name: string) => {
  return name
    .split("")
    .reduce((str, char) =>
      char === char.toUpperCase() ? str + " " + char : str + char
    )
    .concat();
};

export const IssuerCard: FC<IssuerCardProps> = ({ issuer, markets }) => {
  const navigate = useNavigate();
  const { tbvByProtocol } = useBondPurchases();

  const [tbv, setTbv] = useState(0);

  useEffect(() => {
    setTbv(tbvByProtocol.get(issuer.name as PROTOCOL_NAMES) || 0);
  }, [tbvByProtocol]);

  const logo = () => {
    return issuer.logoUrl && issuer.logoUrl != ""
      ? issuer.logoUrl
      : "/placeholders/token-placeholder.png";
  };

  const handleClick = (event: any, name: string) => {
    event.preventDefault();
    navigate("/issuers/" + name);
  };

  return (
    <div
      className="border rounded-lg border-transparent bg-white/[.05] w-min w-[137px] max-w-[137px] p-5 flex flex-col items-center overflow-hidden hover:cursor-pointer hover:bg-white/10"
      onClick={() => handleClick(event, issuer.id)}
    >
      <img className="h-[64px] w-[64px]" src={logo()} />
      <p className="my-2 font-bold tracking-wide text-center">
        {issuer.name.length > 12
          ? splitCamelCaseText(issuer.name)
          : issuer.name}
      </p>
      <p className="text-xs text-light-primary-50">{markets.length} {markets.length === 1 ? "Market" : "Markets"}</p>
      <p className="text-[10px] text-light-primary-300">
        TBV ${Math.floor(tbv)}
      </p>
    </div>
  );
};
