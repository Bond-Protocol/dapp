import type { Token } from "@bond-protocol/types";
import { useQuery } from "@tanstack/react-query";
import { getTokenPriceHistory } from "services";

export const useTokenPriceHistory = (token: Token, dayRange = 90) => {
  const { data: tokenPriceHistory, ...tokenPriceHistoryQuery } = useQuery({
    queryKey: [`token-price-history-${token.symbol}-${dayRange}d`],
    queryFn: getTokenPriceHistory(
      token.address,
      token.chainId,
      { days: dayRange },
      Date.now()
    ),
  });

  return {
    prices: tokenPriceHistory?.prices?.map((element: Array<number>) => ({
      date: element[0],
      price: element[1],
    })),
    isLoading: tokenPriceHistoryQuery.isLoading,
  };
};
