import { UseQueryResult } from "@tanstack/react-query";
import {
  GetClosedMarketsQuery,
  GetDashboardDataQuery,
  GetGlobalDataQuery,
} from "src/generated/graphql";

export const concatSubgraphQueryResultArrays = <
  T extends GetGlobalDataQuery | GetClosedMarketsQuery | GetDashboardDataQuery,
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
