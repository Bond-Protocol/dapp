import { useTokenPrices } from "hooks/useTokenPrices";
import { createContext, useContext } from "react";
import { TokenDetails } from "ui";

export type UseTokensReturn = ReturnType<typeof useTokenPrices>;

const initialState: UseTokensReturn = {
  tokens: [],
  currentPrices: {},
  getPrice: (token: any) => 1,
  getTokenDetails: (token: unknown) => ({ id: "" } as TokenDetails),
  getTokenDetailsFromChain: (a: unknown, b: unknown) =>
    Promise.resolve({ name: "", symbol: "" }),
  isLoading: true,
};

const TokenContext = createContext(initialState);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const tokens = useTokenPrices();

  return (
    // @ts-ignore
    <TokenContext.Provider value={tokens}>{children}</TokenContext.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokenContext);
};
