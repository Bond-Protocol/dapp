import {FC, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {PROTOCOLS} from "@bond-labs/bond-library";
import {Button} from "components";
import {IssuerCard} from "components/molecules/IssuerCard";

export const IssuerList: FC<any> = () => {
  const {verifiedMarkets, unverifiedMarkets, verifiedIssuers, unverifiedIssuers} = useCalculatedMarkets();
  const [showUnverified, setShowUnverified] = useState(false);

  return (
    <>
      {verifiedIssuers.map(issuer =>
        <IssuerCard key={issuer} issuer={PROTOCOLS.get(issuer)} markets={verifiedMarkets.get(issuer)}/>)
      }
      <br/>
      {showUnverified ?
        <Button onClick={() => setShowUnverified(false)}>Hide Unverified</Button> :
        <Button onClick={() => setShowUnverified(true)}>Show Unverified</Button>
      }
      <br/>
      {showUnverified && unverifiedIssuers.map(issuer =>
        <IssuerCard key={issuer} issuer={issuer} markets={unverifiedMarkets.get(issuer)}/>)
      }
    </>
  );
};
