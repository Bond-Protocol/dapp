import { getTokenByAddress } from "@bond-protocol/bond-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";

export const getTokenDetailsForMarket = (market: CalculatedMarket) => {
  const tokens: any = {};

  if (market?.quoteToken?.lpPair) {
    tokens.quote = getTokenByAddress(market?.quoteToken.lpPair.token0.address);
    tokens.lpPair = getTokenByAddress(market?.quoteToken.lpPair.token1.address);
  } else {
    tokens.quote = getTokenByAddress(market?.quoteToken?.address);
  }
  tokens.payout = getTokenByAddress(market?.payoutToken?.address);

  return tokens;
};
