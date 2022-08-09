import {FC} from "react";
import {Protocol} from "@bond-labs/bond-library";
import {ethers} from "ethers";

type IssuerCardProps = {
  issuer: Protocol | string;
}
export const IssuerCard: FC<IssuerCardProps> = ({issuer}) => {
  return ethers.utils.isAddress(issuer) ?
    <>
      <span>{issuer}</span>
    </> :
    <>
      <span>{issuer.name}</span>
    </>;
};
