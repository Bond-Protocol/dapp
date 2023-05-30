import { createContext, useContext } from "react";
import { Token } from "@bond-protocol/contract-library";
import { useTokenLoader } from "services/use-token-loader";

export type ITokenContext = {
  tbv: number;
  tokens: Token[];
  payoutTokens: Token[];
  getByAddress: (address: string) => Token;
  fetchedExtendedDetails?: boolean;
};

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { tbv, tokens, payoutTokens, getByAddress, fetchedExtendedDetails } =
    useTokenLoader();

  console.log({ tokens });
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
