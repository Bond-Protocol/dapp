import { useDashboard } from "context/dashboard-context";
import { formatCurrency, InfoLabel } from "ui";
import { BondList } from "..";

export const UserBonds = () => {
  const { ownerBalances } = useDashboard();

  const tbv =
    ownerBalances?.reduce((total, bond) => {
      //@ts-ignore
      return total + bond.usdPriceNumber;
    }, 0) ?? 0;

  const claimable =
    ownerBalances.reduce((total, bond) => {
      //@ts-ignore
      return bond?.canClaim ? total + (bond?.usdPriceNumber ?? 0) : total;
    }, 0) ?? 0;

  return (
    <div>
      <div className="flex gap-x-4">
        <InfoLabel
          reverse
          label="My TBV"
          tooltip="Total value acquired through bonds in USD"
        >
          {formatCurrency.usdFormatter.format(tbv)}
        </InfoLabel>
        <InfoLabel reverse label="Available to Claim">
          {formatCurrency.usdFormatter.format(claimable)}
        </InfoLabel>
      </div>
      <BondList data={ownerBalances} />
    </div>
  );
};
