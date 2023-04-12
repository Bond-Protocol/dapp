import type { CalculatedMarket, LpPair } from "@bond-protocol/contract-library";
import * as contractLibrary from "@bond-protocol/contract-library";
import {
  TOKENS,
  getTokenByAddress,
  SupportedPriceSource,
} from "@bond-protocol/bond-library";
import { providers } from "services";
import { environment } from "src/environment";

export interface TokenDetails {
  id: string;
  address: string;
  chainId: string;
  logoUrl: string;
  name: string;
  symbol: string;
  decimals: number;
  lpPair: LpPair | undefined;
  priceSources: Array<SupportedPriceSource>;
}

export function getTokenDetailsForMarket(market: CalculatedMarket) {
  const tokens: any = {};

  if (market?.quoteToken?.lpPair) {
    tokens.quote = getTokenByAddress(market?.quoteToken.lpPair.token0.address);
    tokens.lpPair = getTokenByAddress(market?.quoteToken.lpPair.token1.address);
  } else {
    tokens.quote = getTokenByAddress(market?.quoteToken?.address);
  }
  tokens.payout = getTokenByAddress(market?.payoutToken?.address);

  return tokens;
}

export async function getTokenDetailsFromChain(address: string, chain: string) {
  const contract = contractLibrary.IERC20__factory.connect(
    address,
    providers[chain]
  );
  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return { name, symbol, decimals };
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    throw Error(error);
  }
}

export async function getTokenDecimalsFromChain(
  address: string,
  chain: string
) {
  const contract = contractLibrary.IERC20__factory.connect(
    address,
    providers[chain]
  );
  try {
    const [decimals] = await Promise.all([contract.decimals()]);

    return decimals;
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    console.log("getTokenDecimalsFromChain", error, { address, chain });
    if (!environment.isProduction) {
      return 0;
    }
  }
}

export function getTokenDetails(token: any): TokenDetails {
  const bondLibraryToken = TOKENS.get(token.id);

  let pair: LpPair;
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
    //@ts-ignore
    priceSources: bondLibraryToken?.priceSources,
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
}
