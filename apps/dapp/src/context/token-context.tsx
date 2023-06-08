import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = {
  tbv: string;
  tokens: Token[];
  payoutTokens: Token[];
  addToken: (token: Token) => void;
  getByAddress: (address: string) => Token | undefined;
  getByChain: (chainId: number) => Token[] | undefined;
  fetchedExtendedDetails?: boolean;
};

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
