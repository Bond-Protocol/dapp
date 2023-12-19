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

      const accessToken = response?.data.access_token ?? "";
      const refreshToken = response?.data.refresh_token ?? "";

      TokenStorage.setAccessToken(accessToken);
      TokenStorage.setRefreshToken(refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    },
    enabled: false,
  });

  return {
    isLoading: query.isLoading,
    signIn: query.refetch,
    getAccessToken: () =>
      //TODO: validate if this works properly when refreshing a token
      TokenStorage.getAccessToken() ?? query.data?.accessToken,
    isAuthenticated: !!query.data?.accessToken,
  };
};
