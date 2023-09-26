import { useAuth } from "context/auth-provider";
import { useAccount, useChainId, useNetwork } from "wagmi";
import orderService, { OrderConfig } from "./order-service";

const sampleOrders = [
  {
    price: 81,
    discount: "2.14",
    amount: "200",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 8, 11, 0),
  },
  {
    price: 77,
    discount: "8.14",
    amount: "40000000000",
    symbol: "ALCX-ETH SLP",
    expiry: new Date(2023, 8, 8, 11, 0),
  },
].map((d) => ({ ...d, marketPrice: 82 }));

export const useOrderApi = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const auth = useAuth();

  const createOrder = async (order: OrderConfig) => {
    const token = auth.getAccessToken();

    if (!chainId || !address) {
      throw new Error(
        `Failed to create order -> missing properties ${address} ${chainId}`
      );
    }
    console.log({ order });

    const response = await orderService.createOrder({
      chainId,
      address,
      token,
      ...order,
    });
    console.log({ response });
  };

  const list = async () => {
    //return sampleOrders;
    const token = auth.getAccessToken();

    if (!chainId || !token || !address) {
      throw new Error("Not Authenticated");
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
