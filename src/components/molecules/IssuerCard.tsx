import {FC} from "react";
import {Protocol} from "@bond-labs/bond-library";
import {ethers} from "ethers";
import { Market } from "src/generated/graphql";
import {useNavigate} from "react-router-dom";

type IssuerCardProps = {
  issuer: Protocol | string;
  markets: Market[];
}

export const IssuerCard: FC<IssuerCardProps> = ({issuer, markets}) => {
  const navigate = useNavigate();

  const handleClick = (event: any, name: string) => {
    event.preventDefault();
    navigate("/issuers/" + name);
  };

  return ethers.utils.isAddress(issuer) ?
    <div onClick={() => handleClick(event, issuer)}>
      <p>{issuer}</p>
      <p>Markets: {markets.length}</p>
    </div> :
    <div onClick={() => handleClick(event, issuer.id)}>
      <p>{issuer.name}</p>
      <p>Markets: {markets.length}</p>
    </div>;
};
