import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = {
  tbv: number;
  tokens: Token[];
  payoutTokens: Token[];
  getByAddress: (address: string) => Token;
};

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  //const tokens = useTokenPrices();
  const { tbv, tokens, payoutTokens, getByAddress } = useTokenLoader();

  return (
    <TokenContext.Provider value={{ tbv, tokens, payoutTokens, getByAddress }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokenContext);
};
