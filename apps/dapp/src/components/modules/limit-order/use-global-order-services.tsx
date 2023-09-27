import { TokenBase } from "@bond-protocol/contract-library";
import { createContext, useContext } from "react";
import { orderService } from "services/order-service";
import { useQuery } from "wagmi";

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
  const query = useQuery(
    ["orders/supported-tokens"],
    orderService.getSupportedTokens
  );

  const supportedTokens = query?.data?.data ?? [];

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
