import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import authApi from "services/limit-order/order-service";

const getAccessToken = () => sessionStorage.getItem("order_access_token");
const getRefreshToken = () => sessionStorage.getItem("order_refresh_token");
const setAccessToken = (token: string) =>
  sessionStorage.setItem("order_access_token", token);
const setRefreshToken = (token: string) =>
  sessionStorage.setItem("order_refresh_token", token);

export const useAuthApi = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!getAccessToken()
  );

  useEffect(() => {
    // Clear tokens everytime the address changes
    if (getAccessToken() || getRefreshToken()) {
      setAccessToken("");
      setRefreshToken("");
      setIsAuthenticated(false);
    }
  }, [address]);

  const signIn = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setLoading(true);

    try {
      const response = await authApi.signIn(chainId, address);

      setAccessToken(response?.data.access_token!);
      setRefreshToken(response?.data.refresh_token!);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    isAuthenticated,
    isLoading,
    getAccessToken,
    getRefreshToken,
  };
};
