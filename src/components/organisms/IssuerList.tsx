import {FC, useEffect, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {getProtocolByAddress} from "@bond-labs/bond-library";
import {ethers} from "ethers";

export const IssuerList: FC<any> = () => {
  const {allMarkets} = useCalculatedMarkets();

  const [verifiedMarkets, setVerifiedMarkets] = useState(new Map());
  const [unverifiedMarkets, setUnverifiedMarkets] = useState(new Map());

  useEffect(() => {
    const markets = Array.from(allMarkets.values());

    const verified = new Map();
    const unverified = new Map();

    markets.forEach(market => {
      const protocol = getProtocolByAddress(market.owner, market.network);
      const id = protocol?.id || market.owner;
      if (ethers.utils.isAddress(id)) {
        const value = unverified.get(market.owner) || [];
        value.push(market);
        unverified.set(id, value);
      } else {
        const value = verified.get(protocol?.id) || [];
        value.push(market);
        verified.set(id, value);
      }
    });

    setVerifiedMarkets(verified);
    setUnverifiedMarkets(unverified);
  }, [allMarkets]);

  return (
    <div></div>
  );
};
