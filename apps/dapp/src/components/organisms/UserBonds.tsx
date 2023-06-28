import { useDashboard } from "context/dashboard-context";
import { formatCurrency, InfoLabel } from "ui";
import { BondList, TransactionHistory } from "..";

export const UserBonds = () => {
  const { isLoading, ownerBalances, bondPurchases, userTbv, userClaimable } =
    useDashboard();

  return (
    <div>
      <div className="flex gap-x-4">
        <InfoLabel
          reverse
          label="My TBV"
          tooltip="Total value acquired through bonds in USD"
          value={formatCurrency.usdFormatter.format(userTbv)}
        />
        <InfoLabel reverse label="Available to Claim">
          {formatCurrency.usdFormatter.format(userClaimable)}
        </InfoLabel>
      </div>
      <BondList title="Balance" isLoading={isLoading} data={ownerBalances} />
      <TransactionHistory
        title="Bond History"
        className="mb-30"
        data={bondPurchases}
      />
    </div>
  );
};
