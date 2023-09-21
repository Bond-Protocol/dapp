import { useAuth } from "context/auth-provider";
import { useAccount, useChainId, useNetwork } from "wagmi";
import orderService, { OrderConfig } from "./order-service";

export const useOrderApi = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const auth = useAuth();

  const createOrder = async (order: OrderConfig) => {
    const token = auth.getAccessToken();

    if (!chainId || !address || !token) {
      throw new BondProtocolError(
        `Failed to create order -> missing properties`
      );
    }

    const response = await orderService.createOrder({
      chainId,
      address,
      token,
      ...order,
    });
  };

  const list = async () => {
    const token = auth.getAccessToken();

    if (!chainId || !token || !address) {
      throw new BondProtocolError("Not Authenticated");
    }

    const response = await orderService.listAllOrders({
      chainId,
      address,
      token,
    });

    return response;
  };

  return {
    createOrder,
    list,
  };
};
