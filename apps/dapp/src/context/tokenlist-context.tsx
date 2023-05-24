import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { ITokenContext } from "./token-context";
import { useTokenlistLoader } from "services/use-tokenlist-loader";

export interface ITokenlistContext extends ITokenContext {
  tokenlists: Record<string, Token[]>;
  getByChain: (chainId: number) => Token[];
}

const TokenlistContext = createContext<ITokenlistContext>(
  {} as ITokenlistContext
);

export const TokenlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokens } = useTokenlistLoader();
  const tokenlists = {};

  const getByAddress = () => {};

  const getByChain = (chainId: number) =>
    tokens.filter((t) => t.chainId === chainId);

  return (
    <TokenlistContext.Provider
      value={{ tokens, getByChain, tokenlists, getByAddress }}
    >
      {children}
    </TokenlistContext.Provider>
  );
};

export const useTokenlists = () => {
  return useContext(TokenlistContext);
};
