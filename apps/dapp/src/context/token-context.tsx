import { createContext, useContext } from "react";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = ReturnType<typeof useTokenLoader>;

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const tokens = useTokenLoader();

  return (
    <TokenContext.Provider value={tokens}>{children}</TokenContext.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokenContext);
};
