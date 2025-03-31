import { CalculatedMarket } from "@bond-protocol/types";
import { useQuery } from "@tanstack/react-query";
import { loadBondPurchasesByMarket } from "./caching-api-client";
import { featureToggles } from "src/feature-toggles";
import {
  BondPurchase,
  useListBondPurchasesPerMarketQuery,
} from "src/generated/graphql";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { PastMarket } from "components/organisms/ClosedMarket";
import { useTokens } from "hooks/useTokens";
import { useMemo } from "react";

type UseBondPurchaseParameters = {
  market?: CalculatedMarket | PastMarket;
};

export function useBondPurchasesByMarket({
  market,
}: UseBondPurchaseParameters) {
  const isAPIEnabled = featureToggles.CACHING_API;
  const tokens = useTokens();

  const chainId = market?.chainId ?? 0;
  const id = market?.id ?? "";

  const apiQuery = useQuery({
    queryKey: ["api", "bond-purchases", chainId, id],
    queryFn: () => loadBondPurchasesByMarket(id),
    enabled: isAPIEnabled && !!market,
  });

  const subgraphQuery = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[+chainId] },
    { marketId: id },
    {
      queryKey: ["bond-purchases", chainId, id],
      enabled: !isAPIEnabled && !!market,
    }
  );

  const { data, ...query } = isAPIEnabled ? apiQuery : subgraphQuery;

  const bondPurchases = useMemo(() => {
    if (query.isSuccess && tokens.fetchedExtendedDetails) {
      return data?.bondPurchases.map(
        //TODO: fix types
        //@ts-expect-error Graphql Schema address types are string vs Viem's Address types
        tokens.matchTokenPair
      ) as BondPurchase[];
    }
  }, [query.isSuccess, tokens.fetchedExtendedDetails]);

  return {
    data: { bondPurchases },
    ...query,
  };
}
