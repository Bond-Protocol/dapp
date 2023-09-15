import Image from "next/image";
import { InfoLabel } from "../components";

export const PartnerDetailedCard = (props: any) => {
  return (
    <div>
      <div className="flex">
        <Image src={props.logoURI} alt={props.name + "_logo"} />
        <h4>{props.name}</h4>
        <p>{props.description}</p>
        <div>
          <InfoLabel label={props.stats.vesting}>Vesting</InfoLabel>
          <InfoLabel label={props.stats.tbv}>TBV</InfoLabel>
          <InfoLabel label={props.stats.discount}>Average Discount</InfoLabel>
          <InfoLabel label={props.stats.totalBonds}>Bondings</InfoLabel>
        </div>
      </div>
    </div>
  );
};
