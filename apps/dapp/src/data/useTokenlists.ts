import { TokenlistToken } from "@bond-protocol/types";
import { useQueries, UseQueryResult } from "@tanstack/react-query";

const tokenlists = [
  "https://raw.githubusercontent.com/SmolDapp/tokenLists/refs/heads/main/lists/coingecko.json", //coingecko
  "https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/8453.json", //base
  "https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/42161.json", //arbitrum
];

//Default tokenlist is updated once a week so no need to refetch it
const STALE_TIME = 1000 * 60 * 60 * 24 * 7;

/** Retrives multiple tokenlists */
export function useTokenlists(): Pick<
  UseQueryResult<TokenlistToken[]>,
  "data" | "isSuccess" | "isLoading"
> {
  return useQueries({
    queries: tokenlists.map((url) => ({
      queryKey: ["tokenlist", url],
      queryFn: async () => {
        const response = await fetch(url);
        return response.json();
      },
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    })),
    combine: (results) => {
      return {
        data: results.flatMap((q) => q.data?.tokens),
        isSuccess: results.every((q) => q.isSuccess),
        isLoading: results.some((q) => q.isLoading),
      };
    },
  });
}
