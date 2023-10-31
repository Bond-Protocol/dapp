import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { orderService, TokenStorage } from "services/order-service";

type AuthContextState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => void;
  getAccessToken: () => string | null;
};

const initialState = {} as AuthContextState;
export const AuthContext = createContext<AuthContextState>(initialState);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Clear tokens everytime the address changes
    if (TokenStorage.getAccessToken() || TokenStorage.getRefreshToken()) {
      TokenStorage.setAccessToken("");
      TokenStorage.setRefreshToken("");
    }
  }, [address]);

  const signIn = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setLoading(true);

    try {
      const response = await orderService.signIn(chainId, address);

      TokenStorage.setAccessToken(response?.data.access_token!);
      TokenStorage.setRefreshToken(response?.data.refresh_token!);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        signIn,
        getAccessToken: TokenStorage.getAccessToken,
        isAuthenticated: !!TokenStorage.getAccessToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
