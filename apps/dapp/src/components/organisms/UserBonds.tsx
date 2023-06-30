import { useDashboard } from "context/dashboard-context";
import { useMediaQueries } from "hooks/useMediaQueries";
import { formatCurrency, InfoLabel } from "ui";
import { BondList, TransactionHistory } from "..";

export const UserBonds = () => {
  const { isLoading, ownerBalances, bondPurchases, userTbv } = useDashboard();
  const { isTabletOrMobile } = useMediaQueries();

  const claimable =
    ownerBalances.reduce((total, bond) => {
      //@ts-ignore
      return bond?.canClaim ? total + (bond?.usdPriceNumber ?? 0) : total;
    }, 0) ?? 0;

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
      <div className="flex flex-col md:flex-row gap-4">
        {!isTabletOrMobile && tbvElement}
        <InfoLabel className="mt-4 md:mt-0" reverse label="Available to Claim">
          {formatCurrency.usdFormatter.format(claimable)}
        </InfoLabel>
      </div>
      <BondList title="Balance" isLoading={isLoading} data={ownerBalances} />
      {isTabletOrMobile && <div className="mb-10">{tbvElement}</div>}
      <TransactionHistory
        title="Bond History"
        className="mb-30"
        data={bondPurchases}
      />
    </div>
  );
};
