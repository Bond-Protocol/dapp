import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { ITokenContext } from "./token-context";

export interface ITokenlistContext extends ITokenContext {
  tokenlists: Record<string, Token[]>;
}

const TokenlistContext = createContext<ITokenlistContext>(
  {} as ITokenlistContext
);

export const TokenlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tokens = [];
  const tokenlists = {};
  const getByAddress = () => {};

  return (
    <TokenlistContext.Provider value={{ tokens, tokenlists, getByAddress }}>
      {children}
    </TokenlistContext.Provider>
  );
};

export const useTokenlists = () => {
  return useContext(TokenlistContext);
};
