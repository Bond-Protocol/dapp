import { useQueries, UseQueryResult, useQuery } from "@tanstack/react-query";
import { useTokens } from "hooks/useTokens";
import { useMemo } from "react";
import { featureToggles } from "src/feature-toggles";
import {
  BondPurchase,
  ListBondPurchasesForRecipientDocument,
  ListBondPurchasesForRecipientQuery,
} from "src/generated/graphql";
import { concatSubgraphQueryResultArrays } from "src/utils/concatSubgraphQueryResultArrays";
import { queryAllEndpoints } from "src/utils/queryAllEndpoints";
import { loadBondPurchasesByAddress } from "./caching-api-client";
import { useAccount } from "wagmi";

export function useBondPurchasesByAddress() {
  const isAPIEnabled = featureToggles.CACHING_API;
  const { address } = useAccount();
  const tokens = useTokens();

  const apiQuery = useQuery({
    queryKey: ["api", "bond-purchases", address],
    queryFn: () => loadBondPurchasesByAddress(address!),
    enabled: isAPIEnabled && !!address,
  });

  const subgraphQuery = useQueries({
    queries: queryAllEndpoints<ListBondPurchasesForRecipientQuery>({
      document: ListBondPurchasesForRecipientDocument,
      variables: { address },
      enabled: !isAPIEnabled && !!address,
    }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (
          response
        ): response is UseQueryResult<ListBondPurchasesForRecipientQuery> =>
          response?.data !== undefined
      );

      const bondPurchases = concatSubgraphQueryResultArrays(
        filteredResponses,
        "bondPurchases"
      );

      return {
        data: { bondPurchases },
        isLoading: responses.some((response) => response.isLoading),
        isSuccess: responses.every((response) => response.isSuccess),
      };
    },
  });

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
