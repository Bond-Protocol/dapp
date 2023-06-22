import { Token } from "@bond-protocol/contract-library";

export const mergeToken = (
  token: Partial<Token>,
  finder: (address: string) => Token | undefined
) => {
  const extendedToken = finder(token.address ?? "");

  return {
    ...token,
    ...extendedToken,
  };
};

/**
 * Merges payoutToken and quoteToken in any object with more detailed token instances
 * */
export const mergeTokens = (
  source: any,
  finder: (address: string) => Token | undefined
) => {
  return {
    ...source,
    payoutToken: mergeToken(source.payoutToken, finder),
    quoteToken: mergeToken(source.quoteToken, finder),
  };
};
