import {FC, useEffect, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {Protocol, PROTOCOLS} from "@bond-labs/bond-library";
import {MarketList} from "components/organisms/MarketList";
import { CalculatedMarket } from "@bond-labs/contract-library";

type IssuerPageProps = {
  issuer: string;
}

export const IssuerPage: FC<IssuerPageProps> = ({issuer}) => {
  const {marketsByIssuer} = useCalculatedMarkets();
  const [markets, setMarkets] = useState<CalculatedMarket[]>([]);
  const [protocol, setProtocol] = useState<Protocol>(PROTOCOLS.get(issuer));
  const [tbv, setTbv] = useState(0);

  useEffect(() => {
    setMarkets(marketsByIssuer && marketsByIssuer.get(issuer));
  }, [marketsByIssuer]);

  useEffect(() => {
    if (markets) {
      let tbv = 0;
      markets.forEach(market => tbv = tbv + market.tbvUsd);
      setTbv(tbv);
    }
  }, [markets]);

  return (
    <>
      <div className="flex flex-col content-center">
        <div>
          <h1 className="text-5xl">{protocol.name}</h1>
        </div>
        <div>
          <p>{protocol.description}</p>
        </div>
        <div>TBV: ${Math.floor(tbv)}</div>
      </div>

      {markets && <MarketList markets={markets} allowManagement={false}/>}
    </>
  );
};
