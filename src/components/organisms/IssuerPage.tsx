import {FC, useEffect, useState} from "react";
import {ethers} from "ethers";
import {useCalculatedMarkets} from "hooks";
import {Protocol, PROTOCOLS } from "@bond-labs/bond-library";
import {MarketList} from "components/organisms/MarketList";

type IssuerPageProps = {
  issuer: string;
}

export const IssuerPage: FC<IssuerPageProps> = ({issuer}) => {
  const {verifiedMarkets, unverifiedMarkets, verifiedIssuers} = useCalculatedMarkets();
  const verified = !ethers.utils.isAddress(issuer);
  const [markets, setMarkets] = useState([]);
  const [protocol, setProtocol] = useState<Protocol | undefined>(undefined);

  useEffect(() => {
    setMarkets(verified ? verifiedMarkets.get(issuer) : unverifiedMarkets.get(issuer));
    verified && setProtocol(PROTOCOLS.get(issuer));
  }, [verifiedMarkets, unverifiedMarkets]);

  return (
    <>
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">{protocol ? protocol.name : issuer} ({verified ? "Verified" : "Unverified"})</h1>
      </div>

      {markets && <MarketList markets={markets} allowManagement={false} />}
    </>
  );
};
