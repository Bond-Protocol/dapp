import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { orderService, TokenStorage } from "services/order-service";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const query = useQuery({
    queryKey: ["order-siwe", address],
    queryFn: async () => {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      const response = await orderService.signIn(chainId, address);

      TokenStorage.setAccessToken(response?.data.access_token!);
      TokenStorage.setRefreshToken(response?.data.refresh_token!);
    },
    enabled: false,
  });

  useEffect(() => {
    // Clear tokens everytime the address changes
    if (TokenStorage.getAccessToken() || TokenStorage.getRefreshToken()) {
      TokenStorage.setAccessToken("");
      TokenStorage.setRefreshToken("");
    }
  }, [address]);

  return {
    isLoading: query.isLoading,
    signIn: query.refetch,
    getAccessToken: TokenStorage.getAccessToken,
    isAuthenticated: !!TokenStorage.getAccessToken(),
  };
};
