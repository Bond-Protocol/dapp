import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = {
  tbv: string;
  tokens: Token[];
  payoutTokens: Token[];
  getByAddress: (address: string) => Token | undefined;
  fetchedExtendedDetails?: boolean;
};

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { tbv, tokens, payoutTokens, getByAddress, fetchedExtendedDetails } =
    useTokenLoader();

  return (
    <TokenContext.Provider
      value={{
        tbv,
        tokens,
        payoutTokens,
        getByAddress,
        fetchedExtendedDetails,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokenContext);
};
