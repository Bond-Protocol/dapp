import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useState } from "react";
import { Order } from "src/types/openapi";
import { useQuery } from "wagmi";
import { useAuth } from "./use-auth";
import { useOrderApi } from "./use-order-api";

export const useLimitOrderList = (market: CalculatedMarket) => {
  const orderApi = useOrderApi();
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadList() {
    const data: Order[] = await orderApi.list(market);
    const withMarket = data
      .filter(
        (order) =>
          order?.status === "Active" &&
          Number(order.market_id) === market?.marketId
      )
      .map((d) => ({ ...d, market }));
    setOrders(withMarket);
  }

  const query = useQuery(["list-orders", market.id, market.chainId], {
    queryFn: loadList,
    enabled: !!market && auth.isAuthenticated,
  });

  return {
    list: orders,
    isLoading: query.isLoading,
    query,
  };
};
