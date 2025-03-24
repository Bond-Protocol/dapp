import { CalculatedMarket } from "types";
import { Order } from "src/types/openapi";
import { useQuery } from "wagmi";
import { useAuth } from "./use-auth";
import { useOrderApi } from "./use-order-api";

export const useLimitOrderList = (market: CalculatedMarket) => {
  const orderApi = useOrderApi();
  const auth = useAuth();

  async function loadList() {
    const data: Order[] = await orderApi.list(market);
    return data
      .filter(
        (order) =>
          order?.status === "Active" &&
          Number(order.market_id) === market?.marketId
      )
      .map((d) => ({ ...d, market }));
  }

  const query = useQuery(["list-orders", market.id], {
    queryFn: loadList,
    enabled: !!market && auth.isAuthenticated,
  });

  return {
    list: query.data ?? [],
    isLoading: query.isLoading,
    query,
  };
};
