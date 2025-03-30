import { useBondPurchasesByMarket } from "src/data/useBondPurchasesByMarket";
import {
  TransactionHistory,
  TransactionHistoryProps,
} from "./TransactionHistory";

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
      data={data?.bondPurchases}
    />
  );
}
