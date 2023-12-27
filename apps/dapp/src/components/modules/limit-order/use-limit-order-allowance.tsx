import { getAddresses } from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/types";
import { useTokenAllowance } from "hooks/useTokenAllowance";
import { Order } from "src/types/openapi";
import { useMarkets } from "context/market-context";
import { useMemo } from "react";
import { Address, formatUnits, parseUnits } from "viem";

export const useLimitOrderAllowance = (
  market: CalculatedMarket,
  amount: string,
  orders: Order[]
) => {
  const { allMarkets } = useMarkets();

  const requiredAllowance = useMemo(
    () =>
      orders
        .filter((o) => o.status === "Active")
        .filter((element) => {
          const marketsWithSameToken = allMarkets
            .filter(
              (m) =>
                //@ts-ignore
                m.quoteToken.address === market.quoteToken.address &&
                //@ts-ignore
                m.quoteToken.chainId === market.quoteToken.chainId
            )
            //@ts-ignore
            .map((mkt) => mkt.marketId);

          return marketsWithSameToken.includes(Number(element.market_id));
        })
        .reduce(
          (total, order) =>
            total + parseUnits(order.amount ?? "0", market.quoteToken.decimals),
          0n
        ),
    [market, amount, orders]
  );

  const requiredAllowanceForNextOrder =
    requiredAllowance + parseUnits(amount, market.quoteToken.decimals);

  const allowance = useTokenAllowance(
    market.quoteToken.address,
    market.quoteToken.decimals,
    market.chainId,
    formatUnits(requiredAllowanceForNextOrder, market.quoteToken.decimals),
    getAddresses(Number(market.chainId)).settlement as Address
  );

  const hasSuffiencentAllowanceForAllOrders =
    (allowance.allowance?.currentAllowance ?? 0n) >= requiredAllowance;

  const hasSuffiencentAllowanceForNextOrder =
    (allowance.allowance?.currentAllowance ?? 0n) >=
    requiredAllowanceForNextOrder;

  return {
    hasSuffiencentAllowanceForAllOrders,
    hasSuffiencentAllowanceForNextOrder,
    requiredAllowance: requiredAllowance.toString(),
    requiredAllowanceForNextOrder: requiredAllowanceForNextOrder,
    ...allowance,
  };
};
