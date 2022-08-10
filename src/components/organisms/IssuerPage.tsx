import {FC} from "react";
import {ethers} from "ethers";

type IssuerPageProps = {
  issuer: string;
}

export const IssuerPage: FC<IssuerPageProps> = ({issuer}) => {
  const verified = !ethers.utils.isAddress(issuer);
  return (
    <div className="flex justify-between content-center">
      <h1 className="text-5xl">{issuer} ({verified ? "Verified" : "Unverified"})</h1>
    </div>
  );
};
