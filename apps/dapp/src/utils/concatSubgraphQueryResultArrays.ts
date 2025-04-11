import { UseQueryResult } from "@tanstack/react-query";
import {
  GetClosedMarketsQuery,
  GetDashboardDataQuery,
  GetGlobalDataQuery,
  ListBondPurchasesForRecipientQuery,
} from "src/generated/graphql";

type SupportedQueries =
  | GetGlobalDataQuery
  | GetClosedMarketsQuery
  | GetDashboardDataQuery
  | ListBondPurchasesForRecipientQuery;

export const concatSubgraphQueryResultArrays = <
  T extends SupportedQueries,
  K extends keyof Omit<T, "__typename">
>(
  queries: UseQueryResult<T, any>[],
  fieldName: K
) => {
  return queries
    .filter((value, index, self) => !value.isError)
    .map((value) => (value.data as T)[fieldName])
    .filter(
      (fieldArray): fieldArray is NonNullable<T[K]> => fieldArray !== undefined
    )
    .flat();
};
