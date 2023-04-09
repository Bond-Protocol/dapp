import { aphexTokens, Token } from "@bond-protocol/bond-library";

//Map coingecko result to our format
const toProtocolTokens = (token: any) => {
  return {
    name: token.name,
    symbol: token.symbol.toUpperCase(),
    icon: token.image.small,
    addresses: token.platforms,
    links: token.links,
  };
};

export const toTokenList = (
  tokens: Token[],
  getPrice: (id: string) => number
) => {
  return tokens.map((token) => {
    console.log({ token });
    // @ts-ignore
    const apiId = token.priceSources[0]?.apiId;
    // @ts-ignore
    const price = getPrice(token);

    return {
      id: apiId,
      name: token.name,
      symbol: token.symbol,
      icon: token.logoUrl,
      // @ts-ignore
      addresses: token.addresses,
      apiId,
      price,
      priceSources: token.priceSources,
    };
  });
};
