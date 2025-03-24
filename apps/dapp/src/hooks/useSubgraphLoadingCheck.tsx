import { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

export function useSubgraphLoadingCheck(
  queries: Partial<UseQueryResult<any, any>[]>,
  dependencies?: any[]
) {
  const deps = dependencies ? [queries].concat(dependencies) : [queries];

  const isLoading = useMemo(() => {
    return queries.some((query) => query?.isLoading);
  }, [deps]);

  return { isLoading };
}
