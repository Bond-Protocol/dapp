import {FC} from "react";
import {Protocol} from "@bond-labs/bond-library";
import {ethers} from "ethers";
import { Market } from "src/generated/graphql";

type IssuerCardProps = {
  issuer: Protocol | string;
  markets: Market[];
}

export const IssuerCard: FC<IssuerCardProps> = ({issuer, markets}) => {
  return ethers.utils.isAddress(issuer) ?
    <>
      <p>{issuer}</p>
      <p>Markets: {markets.length}</p>
    </> :
    <>
      <p>{issuer.name}</p>
      <p>Markets: {markets.length}</p>
    </>;
};
