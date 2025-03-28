import { useBondPurchasesByMarket } from "src/data/useBondPurchasesByMarket";
import { TransactionHistory } from "./TransactionHistoryList";
import { TransactionHistoryProps } from "./TransactionHistoryList";

export function MarketTransactionHistory({
  market,
  ...props
}: Omit<TransactionHistoryProps, "type">) {
  const { data } = useBondPurchasesByMarket({ market });

  return (
    <TransactionHistory
      {...props}
      type="market"
      market={market}
      //@ts-expect-error TODO: fix this typing, tokens are incompatible
      data={data?.bondPurchases}
    />
  );
}
