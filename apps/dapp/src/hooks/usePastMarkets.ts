import { useMemo } from "react";
import { getSubgraphQueries } from "services/subgraph-endpoints";
import { Market, useGetClosedMarketsQuery } from "src/generated/graphql";
import { concatSubgraphQueryResultArrays } from "src/utils/concatSubgraphQueryResultArrays";
import { useSubgraphLoadingCheck } from "./useSubgraphLoadingCheck";
import { useTokens } from "./useTokens";

export const usePastMarkets = () => {
  const currentTime = useMemo(() => Math.trunc(Date.now() / 1000), []);
  const queries = getSubgraphQueries(useGetClosedMarketsQuery, { currentTime });
  const { isLoading } = useSubgraphLoadingCheck(queries);
  const { getByAddress, tokens } = useTokens();

  const markets = useMemo(() => {
    const response: Market[] = !isLoading
      ? concatSubgraphQueryResultArrays(queries, "markets")
      : [];

    return response?.length
      ? response.map((market: Market) =>
          updateClosedMarkets(getByAddress, market)
        )
      : response;
  }, [isLoading, tokens, getByAddress]);

  return { markets, isLoading };
};

const updateClosedMarkets = (getByAddress: Function, market: Market) => {
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
};
