import { useMyBonds } from "hooks/useMyBonds";
import { formatCurrency, InfoLabel } from "ui";
import { BondList } from "..";

export const UserBonds = () => {
  const { myBonds } = useMyBonds();

  const tbv =
    myBonds?.reduce((total, bond) => {
      //@ts-ignore
      return total + bond.usdPriceNumber;
    }, 0) ?? 0;

  const claimable =
    myBonds.reduce((total, bond) => {
      //@ts-ignore
      return bond?.canClaim ? total + (bond?.usdPriceNumber ?? 0) : total;
    }, 0) ?? 0;

  return (
    <div>
      <div className="flex gap-x-4">
        <InfoLabel
          label="My TBV"
          tooltip="Total value acquired through bonds in USD"
        >
          {formatCurrency.usdFormatter.format(tbv)}
        </InfoLabel>
        <InfoLabel label="Available to Claim">
          {formatCurrency.usdFormatter.format(claimable)}
        </InfoLabel>
      </div>
      <BondList data={myBonds} />
    </div>
  );
};
