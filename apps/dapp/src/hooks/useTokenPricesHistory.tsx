import { useQuery } from "react-query";
import type {
  CustomPriceSource,
  SupportedPriceSource,
} from "@bond-protocol/bond-library";
import type { Token } from "@bond-protocol/contract-library";
import { TOKENS } from "@bond-protocol/bond-library";

import { getTokenPriceHistory } from "services/custom-queries";

export const getPriceSourceForToken = (
  tokenId: string
): Array<SupportedPriceSource | CustomPriceSource> | undefined => {
  return TOKENS.get(tokenId)?.priceSources;
};

export const useTokenPriceHistory = (token: Token, dayRange = 30) => {
  //For now we're only using one price source soooooo
  const [priceSource] = getPriceSourceForToken(token.id);

  if (!priceSource) {
    throw new Error(`Token ${token.symbol} missing price sources.`);
  }

  if ("customPriceFunction" in priceSource) {
    return {
      prices: [],
      isLoading: false,
      isInvalid: true,
    };
  }

  const { data: tokenPriceHistory, ...tokenPriceHistoryQuery } = useQuery(
    `token-price-history-${token.symbol}-${dayRange}d`,
    getTokenPriceHistory(priceSource.apiId, { days: dayRange }, Date.now())
  );

  return {
    prices: tokenPriceHistory?.prices.map((element: Array<number>) => ({
      date: element[0],
      price: element[1],
    })),
    isLoading: tokenPriceHistoryQuery.isLoading,
  };
};
