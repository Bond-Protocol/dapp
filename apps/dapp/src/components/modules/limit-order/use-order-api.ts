import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useAuth } from "./use-auth";
import { useAccount } from "wagmi";
import { signTypedData } from "@wagmi/core";
import {
  orderService,
  OrderConfig,
  OrderRequest,
} from "services/order-service";
const orderTypedDataTypes = {
  Order: [
    { name: "market_id", type: "string" },
    { name: "amount", type: "string" },
    { name: "min_amount_out", type: "string" },
    { name: "max_fee", type: "string" },
    { name: "submitted", type: "string" },
    { name: "deadline", type: "string" },
    { name: "user", type: "address" },
    { name: "recipient", type: "address" },
    { name: "referrer", type: "address" },
  ],
} as const;

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

  const signOrder = async (order: OrderConfig) => {
    const domain = {
      name: "Bond Protocol Orders",
      version: "0.0.7",
      chainId,
    } as const;

    const types = orderTypedDataTypes;

    return signTypedData({
      domain,
      //@ts-ignore
      //TODO: Docs and types aren't matching, prob neeeds a wagmi update
      //needs testing
      value: order,
      types,
      primaryType: "Order",
    });
  };
  const createOrder = async (order: OrderConfig) => {
    if (!address) {
      throw new Error(
        `Failed to create order -> missing properties ${address}`
      );
    }

    const signature = await signOrder(order);

    const response = await orderService.createOrder({
      ...order,
      chainId,
      address,
      signature,
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
