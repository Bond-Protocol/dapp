import { useTokenPrices } from "hooks/useTokenPrices";
import { createContext, useContext } from "react";

const initialState = {
  tokens: [],
  currentPrices: {},
  getPrice: () => {},
  getTokenDetails: () => {},
  getTokenDetailsFromChain: () => {},
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
