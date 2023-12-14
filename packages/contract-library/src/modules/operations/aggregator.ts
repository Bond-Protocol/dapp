import { getAggregator } from '../../modules';
import { Provider } from '@ethersproject/providers';
import { BigNumberish, ethers } from 'ethers';

// Get the auctioneer for the provided market ID
// @param marketId     The ID of the market
export async function getAuctioneer(
  marketId: BigNumberish,
  provider: Provider,
): Promise<string> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.getAuctioneer(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns the Teller that services the market ID
// @param marketId     The ID of the market
export async function getTeller(
  marketId: BigNumberish,
  provider: Provider,
): Promise<string> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.getTeller(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns current capacity of a market
// @param marketId     The ID of the market
export async function currentCapacity(
  marketId: BigNumberish,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.currentCapacity(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Calculate current market price of payout token in quote tokens
// If price is below minimum price, minimum price is returned
// @param marketId     The ID of the market
// Returns price for market (see the specific auctioneer for units)
export async function marketPrice(
  marketId: BigNumberish,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.marketPrice(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Scale value to use when converting between quote token and payout token amounts with marketPrice()
// @param marketId     The ID of the market
// Returns scaling factor for market in configured decimals
export async function marketScale(
  marketId: BigNumberish,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.marketScale(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function marketCounter(provider: Provider): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.marketCounter();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Payout due for amount of quote tokens
// Inputting the zero address will take into account just the protocol fee.
// @param marketId     The ID of the market
// @param amount       Amount of quote tokens to spend
// @param referrer     Address of referrer, used to get fees to calculate accurate payout amount.
// Returns the amount of payout tokens to be paid
export async function payoutFor(
  marketId: BigNumberish,
  amount: string,
  tokenDecimals: number,
  referrer: string,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);
  const amt = ethers.utils.parseUnits(amount, tokenDecimals);

  try {
    return aggregator.payoutFor(amt, marketId, referrer);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Maximum amount of quote token accepted by the market
// Inputting the zero address will take into account just the protocol fee.
// @param marketId     The ID of the market
// @param referrer     Address of referrer, used to get fees to calculate accurate payout amount.
// Returns maximum amount of quote token accepted by the market
export async function maxAmountAccepted(
  marketId: BigNumberish,
  referrer: string,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.maxAmountAccepted(marketId, referrer);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Does market send payout immediately
// @param marketId     The ID of the market
export async function isInstantSwap(
  marketId: BigNumberish,
  provider: Provider,
): Promise<boolean> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.isInstantSwap(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Is a given market accepting deposits
// @param marketId     The ID of the market
export async function isLive(
  marketId: BigNumberish,
  provider: Provider,
): Promise<boolean> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.isLive(marketId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns array of active market IDs within a range
// Should be used if length exceeds max to query entire array
export async function liveMarketsBetween(
  firstIndex: BigNumberish,
  lastIndex: BigNumberish,
  provider: Provider,
): Promise<BigNumberish[]> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.liveMarketsBetween(firstIndex, lastIndex);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns an array of all active market IDs for a given quote/payout token
// @param tokenAddress     Address of token to query by
// @param isPayout         If true, search by payout token, else search for quote token
export async function liveMarketsFor(
  tokenAddress: string,
  isPayout: boolean,
  provider: Provider,
): Promise<BigNumberish[]> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.liveMarketsFor(tokenAddress, isPayout);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns an array of all active market IDs for a given owner
// @param ownerAddress    Address of owner to query by
export async function liveMarketsBy(
  ownerAddress: string,
  firstIndex: BigNumberish,
  lastIndex: BigNumberish,
  provider: Provider,
): Promise<BigNumberish[]> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.liveMarketsBy(ownerAddress, firstIndex, lastIndex);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns an array of all active market IDs for a given payout and quote token
export async function marketsFor(
  payoutTokenAddress: string,
  quoteTokenAddress: string,
  provider: Provider,
): Promise<BigNumberish[]> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.marketsFor(payoutTokenAddress, quoteTokenAddress);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Returns a single market ID for a given payout and quote token, matching filter requirements
export async function findMarketFor(
  payoutTokenAddress: string,
  quoteTokenAddress: string,
  amountIn: string,
  minAmountOut: string,
  maxExpiry: string,
  provider: Provider,
): Promise<BigNumberish> {
  const aggregator = await getAggregator(provider);

  try {
    return aggregator.findMarketFor(
      payoutTokenAddress,
      quoteTokenAddress,
      amountIn,
      minAmountOut,
      maxExpiry,
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}
