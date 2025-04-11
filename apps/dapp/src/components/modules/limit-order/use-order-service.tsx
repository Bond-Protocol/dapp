import { TokenBase } from "@bond-protocol/types";
import { ACTIVE_CHAIN_IDS } from "src/config/chains";
import { useQueries } from "@tanstack/react-query";
import { orderService } from "services/order-service";
import { Address } from "viem";

type SupportedToken = {
  chain_id: string;
  address: Address;
};

export const useOrderService = () => {
  const queries = useQueries({
    queries: ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/supported-tokens", chainId],
      queryFn: () => orderService.getSupportedTokensByChain(chainId),
    })),
  });

  const supportedTokens = queries.flatMap(
    (q) => q.data?.data ?? []
  ) as SupportedToken[];

  const isTokenSupported = (token: TokenBase) => {
    return supportedTokens.some(
      (t) =>
        String(t.address).toLowerCase() === token.address.toLowerCase() &&
        Number(t.chain_id) === token.chainId
    );
  };

  return { supportedTokens, isTokenSupported };
};
