import {FC, useEffect, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {getProtocolByAddress, PROTOCOLS} from "@bond-labs/bond-library";
import {ethers} from "ethers";
import {Button} from "components";

export const IssuerList: FC<any> = () => {
  const {allMarkets} = useCalculatedMarkets();

  const [verifiedIssuers, setVerifiedIssuers] = useState([]);
  const [unverifiedIssuers, setUnverifiedIssuers] = useState([]);
  const [verifiedMarkets, setVerifiedMarkets] = useState(new Map());
  const [unverifiedMarkets, setUnverifiedMarkets] = useState(new Map());
  const [showUnverified, setShowUnverified] = useState(false);

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

    setVerifiedIssuers(Array.from(verified.keys()));
    setUnverifiedIssuers(Array.from(unverified.keys()));

    setVerifiedMarkets(verified);
    setUnverifiedMarkets(unverified);
  }, [allMarkets]);

  return (
    <>
      {verifiedIssuers.map(issuer => <span key={issuer}>{PROTOCOLS.get(issuer)?.name}</span>)}
      <br />
      {showUnverified ?
        <Button onClick={() => setShowUnverified(false)}>Hide Unverified</Button> :
        <Button onClick={() => setShowUnverified(true)}>Show Unverified</Button>
      }
      <br />
      {showUnverified && unverifiedIssuers.map(issuer => <span key={issuer}>{issuer}</span>)}
    </>
  );
};
