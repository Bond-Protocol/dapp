import { useAuth } from "context/auth-provider";
import { useAccount, useNetwork } from "wagmi";
import orderService, { OrderConfig } from "./order-service";

export const useOrderApi = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const auth = useAuth();

  const createOrder = async (order: OrderConfig) => {
    const token = auth.getAccessToken();
    if (!chain || !address || !token) return;

    const response = await orderService.createOrder({
      chainId: chain?.id,
      address,
      token,
      ...order,
    });
  };

  return {
    createOrder,
  };
};
