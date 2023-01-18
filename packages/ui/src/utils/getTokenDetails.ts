import * as bondLibrary from "@bond-protocol/bond-library";

export interface TokenDetails {
  id: string;
  address: string;
  chainId: string;
  logoUrl: string;
  name: string;
  symbol: string;
  decimals: number;
  lpPair: any | undefined;
}

export const getTokenDetails = (token: any): TokenDetails => {
  const bondLibraryToken = bondLibrary.TOKENS.get(token.id);

  let pair: any;
  if (token.lpPair != undefined) {
    pair = {
      // @ts-ignore
      token0: getTokenDetails(token.lpPair.token0),
      // @ts-ignore
      token1: getTokenDetails(token.lpPair.token1),
    };
  }

  return {
    id: token.id,
    address: token.address,
    chainId: token.id.split("_")[0],
    logoUrl: bondLibraryToken?.logoUrl
      ? bondLibraryToken.logoUrl
      : "/placeholders/token-placeholder.png",
    name: bondLibraryToken ? bondLibraryToken.name : token.name,
    symbol: bondLibraryToken ? bondLibraryToken.symbol : token.symbol,
    decimals: token.decimals,
    // @ts-ignore
    lpPair: pair,
  };
};
