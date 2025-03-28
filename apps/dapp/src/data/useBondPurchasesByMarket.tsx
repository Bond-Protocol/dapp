import { CalculatedMarket } from "@bond-protocol/types";
import { useQuery } from "@tanstack/react-query";
import { loadBondPurchases } from "./caching-api-client";
import { featureToggles } from "src/feature-toggles";
import { useListBondPurchasesPerMarketQuery } from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { PastMarket } from "components/organisms/ClosedMarket";
import { useTokens } from "hooks/useTokens";
import { useMemo } from "react";

type UseBondPurchaseParameters = {
  market: CalculatedMarket | PastMarket;
};

export function useBondPurchasesByMarket({
  market,
}: UseBondPurchaseParameters) {
  const isAPIEnabled = featureToggles.CACHING_API;
  const tokens = useTokens();

  const apiQuery = useQuery({
    queryKey: ["api", "bond-purchases", market.chainId, market.id],
    queryFn: () => loadBondPurchases(market.id),
    enabled: isAPIEnabled && !!market,
  });

  const subgraphQuery = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[+market.chainId] },
    { marketId: market.id },
    {
      queryKey: ["bond-purchases", market.chainId, market.id],
      enabled: !isAPIEnabled && !!market,
    }
  );

  const { data, ...query } = isAPIEnabled ? apiQuery : subgraphQuery;

  const bondPurchases = useMemo(() => {
    if (query.isSuccess && tokens.fetchedExtendedDetails) {
      return data?.bondPurchases.map((p) => {
        const quoteToken =
          tokens.getByAddressAndChain(p.quoteToken.address, market.chainId) ??
          p.quoteToken;
        const payoutToken =
          tokens.getByAddressAndChain(p.payoutToken.address, market.chainId) ??
          p.payoutToken;
        return {
          ...p,
          quoteToken,
          payoutToken,
        };
      });
    }
  }, [query.isSuccess, tokens.fetchedExtendedDetails]);

  return {
    data: { bondPurchases },
    ...query,
  };
}
