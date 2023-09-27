import { useQuery } from "react-query";
import { CalculatedMarket } from "@bond-protocol/contract-library";
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

export const useOrderApi = (market: CalculatedMarket) => {
  const { address } = useAccount();
  const chainId = Number(market.chainId);
  const auth = useAuth();

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

  const list = async () => {
    const token = auth.getAccessToken();

    if (!chainId || !token || !address) {
      throw new Error("Not Authenticated");
    }

    const response = await orderService.listAllOrders({
      chainId,
      address,
      token,
      market,
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
    createOrder,
    cancelOrder,
    cancelAllOrders,
  };
};
