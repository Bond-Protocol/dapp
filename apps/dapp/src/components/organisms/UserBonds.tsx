import { useDashboard } from "context/dashboard-context";
import { useMediaQueries } from "hooks/useMediaQueries";
import { formatCurrency, InfoLabel } from "ui";
import { BondList, TransactionHistory } from "..";

export const UserBonds = () => {
  const { isLoading, ownerBalances, bondPurchases, userTbv, userClaimable } =
    useDashboard();
  const { isTabletOrMobile } = useMediaQueries();

  const tbvElement = (
    <InfoLabel
      reverse
      label="My TBV"
      tooltip="Total value acquired through bonds in USD"
      value={formatCurrency.usdFormatter.format(userTbv)}
    />
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row">
        {!isTabletOrMobile && tbvElement}
        <InfoLabel className="mt-4 md:mt-0" reverse label="Available to Claim">
          {formatCurrency.usdFormatter.format(userClaimable)}
        </InfoLabel>
      </div>
      <BondList
        className="mt-10"
        title="Balance"
        isLoading={isLoading}
        data={ownerBalances}
      />
      {isTabletOrMobile && <div className="mb-10">{tbvElement}</div>}
      <TransactionHistory
        title="Bond History"
        className="mb-30"
        data={bondPurchases}
      />
    </div>
  );
};
