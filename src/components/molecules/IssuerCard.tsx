import { FC, useEffect, useState } from "react";
import { Protocol } from "@bond-labs/bond-library";
import { ethers } from "ethers";
import { Market } from "src/generated/graphql";
import { useNavigate } from "react-router-dom";
import { CalculatedMarket } from "@bond-labs/contract-library";

type IssuerCardProps = {
  issuer: Protocol;
  markets: CalculatedMarket[];
};

const formatName = (name: string) => {
  return name
    .split("")
    .reduce((str, char) =>
      char === char.toUpperCase() ? str + " " + char : str + char
    )
    .concat();
};

export const IssuerCard: FC<IssuerCardProps> = ({ issuer, markets }) => {
  const navigate = useNavigate();

  const [tbv, setTbv] = useState(0);

  useEffect(() => {
    if (markets) {
      let tbv = 0;
      markets.forEach((market) => (tbv = tbv + market.tbvUsd));
      setTbv(tbv);
    }
  }, [markets]);

  const logo = () => {
    return issuer.logo && issuer.logo != ""
      ? issuer.logo
      : "/placeholders/token-placeholder.png";
  };

  const handleClick = (event: any, name: string) => {
    event.preventDefault();
    navigate("/issuers/" + name.toLowerCase());
  };

  return (
    <div
      className="border rounded-lg border-transparent bg-white/[.05] w-min w-[137px] max-w-[137px] p-5 flex flex-col items-center overflow-hidden hover:cursor-pointer"
      onClick={() => handleClick(event, issuer.id)}
    >
      <img className="h-[64px] w-[64px]" src={logo()} />
      <p className="my-2 font-bold tracking-wide text-center">
        {issuer.name.length > 12 ? formatName(issuer.name) : issuer.name}
      </p>
      <p className="text-xs text-light-primary-50">{markets.length} Markets</p>
      <p className="text-[10px] text-light-primary-300">
        TBV ${Math.floor(tbv)}
      </p>
    </div>
  );
};
