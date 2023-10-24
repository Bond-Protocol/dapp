import { ACTIVE_CHAIN_IDS } from "context/evm-provider";
import { useMarkets } from "context/market-context";
import { useQueries } from "react-query";
import { Table, toTableData, useSorting } from "ui";
import { LimitOrderList } from "./LimitOrderList";
import { useLimitOrderList } from "./use-limit-order-list";
import { useOrderApi } from "./use-order-api";
import { orderService } from "services/order-service";

export const LimitOrderFullList = () => {
  const orders = useOrderApi();
  const { allMarkets } = useMarkets();
  const queries = useQueries(
    ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/list-all", chainId],
      queryFn: () =>
        orders.listRaw(chainId).then((result) => {
          return result.map((order) => {
            const market = allMarkets.find(
              (mkt) => Number(mkt.marketId) === Number(order.market_id)
            );
            console.log({ allMarkets, order });
            console.log("here");
            if (!market) return order;
            return {
              ...orderService.parseOrder(order, market),
              market,
            };
          });
        }),
    }))
  );

  console.log({ queries });
  return <div />;
};
