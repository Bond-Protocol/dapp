import { useQuery } from "react-query";
import type { Token } from "@bond-protocol/types";
import { getTokenPriceHistory } from "services";

export const useTokenPriceHistory = (token: Token, dayRange = 90) => {
  if (!token) return;

  const { data: tokenPriceHistory, ...tokenPriceHistoryQuery } = useQuery(
    `token-price-history-${token.symbol}-${dayRange}d`,
    getTokenPriceHistory(
      token.address,
      token.chainId,
      { days: dayRange },
      Date.now()
    )
  );

  return {
    prices: tokenPriceHistory?.prices?.map((element: Array<number>) => ({
      date: element[0],
      price: element[1],
    })),
    isLoading: tokenPriceHistoryQuery.isLoading,
  };
};
