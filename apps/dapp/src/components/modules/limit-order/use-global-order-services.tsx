import { TokenBase } from "types";
import { ACTIVE_CHAIN_IDS } from "context/blockchain-provider";
import { useQueries } from "@tanstack/react-query";
import { orderService } from "services/order-service";

export const useOrderService = () => {
  const queries = useQueries({
    queries: ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/supported-tokens", chainId],
      queryFn: () => orderService.getSupportedTokensByChain(chainId),
    })),
  });

  const supportedTokens = queries.flatMap((q) => q.data?.data ?? []);

  const isTokenSupported = (token: TokenBase) => {
    return supportedTokens.some(
      (t) =>
        //@ts-ignore types need fixing
        String(t.address).toLowerCase() === token.address.toLowerCase() &&
        //@ts-ignore types need fixing
        Number(t.chain_id) === token.chainId
    );
  };

  return { supportedTokens, isTokenSupported };
};
