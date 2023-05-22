import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = {
  tokens: Token[];
  getByAddress: (address: string) => Token;
};

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  //const tokens = useTokenPrices();
  const { tokens } = useTokenLoader();

  const getByAddress = (address: string) =>
    tokens.find((t) => t.address === address.toLowerCase());

  return (
    <TokenContext.Provider value={{ tokens, getByAddress }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokenContext);
};
