import { createContext, useContext } from "react";
import { ITokenContext } from "./token-context";
import { useTokenlistLoader } from "services/use-tokenlist-loader-v2";

export type ITokenlistContext = Omit<
  ITokenContext,
  "tbv" | "payoutTokens" | "getByAddressAndChain"
>;

const TokenlistContext = createContext<ITokenlistContext>(
  {} as ITokenlistContext
);

export const TokenlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tokens = useTokenlistLoader();

  return (
    <TokenlistContext.Provider value={tokens}>
      {children}
    </TokenlistContext.Provider>
  );
};

export const useTokenlists = () => {
  return useContext(TokenlistContext);
};
