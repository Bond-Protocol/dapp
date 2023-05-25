import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { ITokenContext } from "./token-context";
import { useTokenlistLoader } from "services/use-tokenlist-loader";

export interface ITokenlistContext extends ITokenContext {
  getByChain: (chainId: number) => Token[];
  addToken: (token: Token) => void;
}

const TokenlistContext = createContext<ITokenlistContext>(
  {} as ITokenlistContext
);

export const TokenlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokens, addToken } = useTokenlistLoader();

  const getByAddress = () => {};

  const getByChain = (chainId: number) =>
    tokens.filter((t) => t.chainId === chainId);

  return (
    <TokenlistContext.Provider
      value={{ addToken, tokens, getByChain, getByAddress }}
    >
      {children}
    </TokenlistContext.Provider>
  );
};

export const useTokenlists = () => {
  return useContext(TokenlistContext);
};
