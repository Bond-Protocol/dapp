import { useQueries, UseQueryResult } from "@tanstack/react-query";

import { Token } from "@bond-protocol/contract-library";
import {
  GetClosedMarketsDocument,
  GetClosedMarketsQuery,
} from "src/generated/graphql";
import { concatSubgraphQueryResultArrays } from "src/utils/concatSubgraphQueryResultArrays";
import { useTokens } from "./useTokens";
import { queryAllEndpoints } from "src/utils/queryAllEndpoints";

/**
 * Fetches global data from all subgraphs
 */
export const usePastMarkets = () => {
  const { getByAddress } = useTokens();

  return useQueries({
    queries: queryAllEndpoints<GetClosedMarketsQuery>({
      document: GetClosedMarketsDocument,
    }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (response): response is UseQueryResult<GetClosedMarketsQuery> =>
          response?.data !== undefined
      );
      const markets = concatSubgraphQueryResultArrays(
        filteredResponses,
        "markets"
      );

      const closedMarkets = markets
        .map((market) => updateClosedMarkets(getByAddress, market))
        .filter((m) => (m.total?.payoutUsd ?? 0) > 100);

      return {
        data: { closedMarkets },
        isLoading: responses.some((r) => r.isLoading),
      };
    },
  });
};

function updateClosedMarkets(
  getByAddress: (address: string) => Token | undefined,
  market: GetClosedMarketsQuery["markets"][number]
) {
  const quoteToken = getByAddress(market.quoteToken.address);
  const payoutToken = getByAddress(market.payoutToken.address);
  const total = market.bondPurchases?.reduce(
    (all, p, i, arr) => {
      const quotePrice = quoteToken?.price ?? 0;
      const payoutPrice = payoutToken?.price ?? 0;

      const totalQuoteUsd = quotePrice * Number(p.amount);
      const totalPayoutUsd = payoutPrice * Number(p.payout);

      let avgPrice = all.avgPrice + Number(p.purchasePrice);

      if (i === arr.length - 1 && arr.length !== 1) {
        avgPrice = avgPrice / i;
      }

      return {
        quoteUsd: all.quoteUsd + totalQuoteUsd,
        payoutUsd: all.payoutUsd + totalPayoutUsd,
        quote: all.quote + Number(p.amount),
        payout: all.payout + Number(p.payout),
        avgPrice,
      };
    },
    { quoteUsd: 0, payoutUsd: 0, quote: 0, payout: 0, avgPrice: 0 }
  );
  return {
    ...market,
    total,
    quoteToken: quoteToken ?? market.quoteToken,
    payoutToken: payoutToken ?? market.payoutToken,
  };
}
