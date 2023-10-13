import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useAuth } from "./use-auth";
import { useAccount } from "wagmi";
import { orderService } from "services/order-service";
import { Order } from "src/types/openapi";

export const useOrderApi = () => {
  const { address } = useAccount();
  const auth = useAuth();

  const list = async (market: CalculatedMarket) => {
    const token = auth.getAccessToken();

    if (!market.chainId || !token || !address) {
      throw new Error("Not Authenticated");
    }

    const orders = await orderService.listAllOrders({
      chainId: Number(market.chainId),
      address,
      token,
    });

    return orders.map((o) => orderService.parseOrder(o, market));
  };

  const estimateFee = async (chainId: number, marketId: number) => {
    return orderService.estimateFee(chainId, marketId);
  };

  const createOrder = async (order: Order, chainId: number) => {
    if (!address) {
      throw new Error(
        `Failed to create order -> missing properties ${address}`
      );
    }

    const signature = await orderService.signOrder(order, chainId);

    const response = await orderService.createOrder({
      ...order,
      chainId,
      address,
      signature,
    });
    return response;
  };

  const cancelOrder = async (digest: string, chainId: number) => {
    const token = auth.getAccessToken();

    if (!token) throw new Error("Not Authenticated");

    return orderService.cancelOrder({
      token,
      chainId,
      digest,
      address: address as string,
    });
  };

  const cancelAllOrders = async (marketId: string, chainId: number) => {
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
