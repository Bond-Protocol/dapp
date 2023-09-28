import { TokenBase } from "@bond-protocol/contract-library";
import { ACTIVE_CHAIN_IDS } from "context/evm-provider";
import { createContext, useContext } from "react";
import { useQueries } from "react-query";
import { orderService } from "services/order-service";

type OrderServiceContext = {
  supportedTokens: any[];
  isTokenSupported: (t: TokenBase) => boolean;
};

const OrderServiceContext = createContext<OrderServiceContext>({
  supportedTokens: [],
  isTokenSupported: () => false,
});

export const useOrderService = () => {
  return useContext(OrderServiceContext);
};

export const OrderServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queries = useQueries(
    ACTIVE_CHAIN_IDS.map((chainId) => ({
      queryKey: ["orders/supportedtokens", chainId],
      queryFn: () => orderService.getSupportedTokensByChain(chainId),
    }))
  );

  const supportedTokens = queries.flatMap((q) => q.data?.data ?? []);

  const isTokenSupported = (token: TokenBase) => {
    return supportedTokens.some(
      //@ts-ignore types need fixing
      (t) => t.address === token.address && t.chain_id === token.chainId
    );
  };

  return (
    <OrderServiceContext.Provider value={{ supportedTokens, isTokenSupported }}>
      {children}
    </OrderServiceContext.Provider>
  );
};
