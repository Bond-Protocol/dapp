import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import orderService, { OrderConfig } from "./order-service";

const getAccessToken = () => sessionStorage.getItem("order_access_token");
const getRefreshToken = () => sessionStorage.getItem("order_refresh_token");
const setAccessToken = (token: string) =>
  sessionStorage.setItem("order_access_token", token);
const setRefreshToken = (token: string) =>
  sessionStorage.setItem("order_refresh_token", token);

export const useOrderApi = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [state, setState] = useState<{ loading: boolean }>();

  const signIn = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setState((s) => ({ ...s, loading: true }));

    try {
      const response = await orderService.signIn(chainId, address);

      setAccessToken(response?.data.access_token!);
      setRefreshToken(response?.data.refresh_token!);
    } catch (e) {
      console.error(e);
    }
  };

  const createOrder = async (order: OrderConfig) => {
    const token = getAccessToken();
    if (!chain || !address || !token) return;

    const response = await orderService.createOrder({
      chainId: chain?.id,
      address,
      token,
      ...order,
    });

    console.log({ response });
  };

  return {
    signIn,
    createOrder,
    getAccessToken,
    getRefreshToken,
  };
};
