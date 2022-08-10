import {PageContainer} from "components/atoms/PageContainer";
import {Tabs} from "components/molecules/Tabs";
import {useParams} from "react-router-dom";
import {FC} from "react";
import {ethers} from "ethers";

type IssuersProps = {
  issuer: string;
}

export const Issuer: FC<IssuersProps> = ({issuer}) => {
  const verified = !ethers.utils.isAddress(issuer);
  return (
    <div className="flex justify-between content-center">
      <h1 className="text-5xl">{issuer} ({verified ? "Verified" : "Unverified"})</h1>
    </div>
  );
};
