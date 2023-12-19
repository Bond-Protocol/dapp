import { useQueries, UseQueryResult } from "@tanstack/react-query";
import {
  testnetEndpoints,
  mainnetEndpoints,
} from "services/subgraph-endpoints";
import { environment } from "src/environment";
import {
  GetGlobalDataDocument,
  GetGlobalDataQuery,
} from "src/generated/graphql";
import { DocumentNode } from "graphql";
import { concatSubgraphQueryResultArrays } from "src/utils/concatSubgraphQueryResultArrays";
import { queryAllEndpoints } from "src/utils/queryAllEndpoints";

export type TypedDocumentNode<
  Result = Record<string, unknown>,
  Variables = Record<string, unknown>
> = DocumentNode;

/**
 * Fetches global data from all subgraphs
 */
export const useGetGlobalData = () => {
  return useQueries({
    queries: queryAllEndpoints<GetGlobalDataQuery>({
      document: GetGlobalDataDocument,
    }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (response): response is UseQueryResult<GetGlobalDataQuery> =>
          response?.data !== undefined
      );

      if (filteredResponses.length === 0)
        return {
          data: {
            markets: [],
            totalPurchases: 0,
            uniqueBonders: 0,
            subgraphTokens: [],
          },
          isLoading: true,
        };

      const totalPurchases = concatSubgraphQueryResultArrays(
        filteredResponses,
        "purchaseCounts"
      ).reduce((total, pc) => total + Number(pc.count), 0);

      const uniqueBonders = concatSubgraphQueryResultArrays(
        filteredResponses,
        "uniqueTokenBonderCounts"
      ).reduce((total, ub) => total + Number(ub.count), 0);

      const subgraphTokens = concatSubgraphQueryResultArrays(
        filteredResponses,
        "tokens"
      );
      const markets = subgraphTokens
        .map((token) => token.markets)
        .flat()
        .filter(
          (market): market is NonNullable<typeof market> =>
            market !== null && market !== undefined
        );
      return {
        data: {
          markets,
          totalPurchases,
          uniqueBonders,
          subgraphTokens,
        },
        isLoading: responses.some((response) => response.isLoading),
      };
    },
  });
};
