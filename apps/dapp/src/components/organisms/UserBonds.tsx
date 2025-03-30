import { useDashboard, useMediaQueries } from "hooks";
import { formatCurrency, InfoLabel } from "ui";
import { BondList, TransactionHistoryData } from "..";
import { TransactionHistory } from "components/lists/TransactionHistory";

export const UserBonds = () => {
  const { isLoading, ownerBalances, bondPurchases, tbv, userClaimable } =
    useDashboard();
  const { isTabletOrMobile } = useMediaQueries();

  const tbvElement = (
    <InfoLabel
      reverse
      label="My TBV"
      tooltip="Total value acquired through bonds in USD"
      value={formatCurrency.usdFormatter.format(tbv)}
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
        type="user"
        title="Bond History"
        className="mb-30"
        data={bondPurchases as TransactionHistoryData}
      />
    </div>
  );
};
