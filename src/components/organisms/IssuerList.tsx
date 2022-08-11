import {FC, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {PROTOCOLS} from "@bond-labs/bond-library";
import {Button} from "components";
import {IssuerCard} from "components/molecules/IssuerCard";

export const IssuerList: FC<any> = () => {
  const {marketsByIssuer, issuers} = useCalculatedMarkets();

  return (
    <>
      {issuers.map(issuer =>
        <IssuerCard key={issuer} issuer={PROTOCOLS.get(issuer)} markets={marketsByIssuer.get(issuer)}/>)
      }
    </>
  );
};
