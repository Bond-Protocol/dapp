import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useAuth } from "./use-auth";
import { useAccount } from "wagmi";
import { orderService, OrderConfig } from "services/order-service";

export const useOrderApi = (market: CalculatedMarket) => {
  const { address } = useAccount();
  const chainId = Number(market.chainId);
  const auth = useAuth();

  const list = async () => {
    const token = auth.getAccessToken();

    if (!chainId || !token || !address) {
      throw new Error("Not Authenticated");
    }

    return orderService.listAllOrders({
      chainId,
      address,
      token,
      market,
    });
  };

  const estimateFee = async (chainId: number, marketId: number) => {
    return orderService.estimateFee(chainId, marketId);
  };

  const createOrder = async (order: OrderConfig) => {
    if (!address) {
      throw new Error(
        `Failed to create order -> missing properties ${address}`
      );
    }

    const response = await orderService.createOrder({
      chainId,
      address,
      ...order,
    });
    return response;
  };

  const cancelOrder = async (digest: string) => {
    const token = auth.getAccessToken();
    if (!token) {
      return;
    }

    const response = await orderService.cancelOrder({
      token,
      chainId,
      digest,
      address: address as string,
    });
    return response;
  };

  const cancelAllOrders = async (marketId: string) => {
    const token = auth.getAccessToken();

    if (!token) {
      return;
    }

    const response = await orderService.cancelAllOrders({
      chainId,
      address: address as string,
      marketId,
      token,
    });

    return response;
  };

  return {
    list,
    estimateFee,
    createOrder,
    cancelOrder,
    cancelAllOrders,
  };
};
