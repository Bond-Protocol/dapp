import {
  CalculatedMarket,
  getAddresses,
} from "@bond-protocol/contract-library";
import { useTokenAllowance } from "hooks/useTokenAllowance";
import { useAccount, useSigner } from "wagmi";
import { providers } from "services/owned-providers";
import { Order } from "src/types/openapi";
import { useMarkets } from "context/market-context";
import { BigNumber } from "ethers";
import { useMemo } from "react";

export const useLimitOrderAllowance = (
  market: CalculatedMarket,
  amount: string,
  orders: Order[]
) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
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
          (total, order) => total.add(Number(order.amount) ?? 0),
          BigNumber.from(0)
        ),
    [market, amount, orders]
  );

  const requiredAllowanceForNextOrder = requiredAllowance.add(
    amount.length ? amount : 0
  );

  const provider = providers[market.chainId];

  const allowance = useTokenAllowance(
    address ?? "",
    market.quoteToken.address,
    market.quoteToken.decimals,
    market.chainId,
    getAddresses(market.chainId).settlement,
    requiredAllowanceForNextOrder.toString(),
    provider,
    signer!,
    true
  );

  const hasSuffiencentAllowanceForAllOrders =
    Number(allowance.allowance) >= requiredAllowance.toNumber();

  const hasSuffiencentAllowanceForNextOrder =
    Number(allowance.allowance) >= requiredAllowanceForNextOrder.toNumber();

  return {
    hasSuffiencentAllowanceForAllOrders,
    hasSuffiencentAllowanceForNextOrder,
    requiredAllowance: requiredAllowance.toString(),
    requiredAllowanceForNextOrder: requiredAllowanceForNextOrder.toNumber(),
    ...allowance,
  };
};
