import { CalculatedMarket, PrecalculatedMarket } from "@bond-protocol/types";
import { Address, PublicClient, formatUnits, getContract } from "viem";
import {
  formatDate,
  intervalToDuration,
  trimAsNumber,
  trimToken,
  usdFullFormatter,
  usdLongFormatter,
} from "formatters";
import {
  Auctioneer,
  getAuctioneerAbiForName,
  getBlockExplorer,
} from "../core";
import { abis } from "../abis";

/**
 * Calculates bond market status and formats it from subgraph into a displayable format
 */
export async function calculateMarket(
  subgraphMarket: PrecalculatedMarket,
  publicClient: PublicClient,
  referrerAddress: Address = `0x${"0".repeat(40)}`
): Promise<CalculatedMarket> {
  const market = createBaseMarket(subgraphMarket);
  const { quoteToken, payoutToken } = market;

  const auctioneerContract = getContract({
    abi: getAuctioneerAbiForName(market.name as Auctioneer),
    address: market.auctioneer,
    publicClient,
  });

  const payoutTokenContract = getContract({
    abi: abis.erc20,
    address: payoutToken.address,
    publicClient,
  });

  const marketId = BigInt(market.marketId);

  const [
    ownerPayoutBalance,
    ownerPayoutAllowance,
    _currentCapacity,
    marketPrice,
    marketScale,
    marketInfo,
    isLive,
    markets,
    _maxAmountAccepted,
  ] = await Promise.all([
    payoutTokenContract.read.balanceOf([market.owner]),
    payoutTokenContract.read.allowance([market.owner, market.teller]),
    auctioneerContract.read.currentCapacity([marketId]),
    auctioneerContract.read.marketPrice([marketId]),
    auctioneerContract.read.marketScale([marketId]),
    auctioneerContract.read.getMarketInfoForPurchase([marketId]),
    auctioneerContract.read.isLive([marketId]),
    auctioneerContract.read.markets([marketId]),
    auctioneerContract.read.maxAmountAccepted([marketId, referrerAddress]),
  ]);

  const baseScale = Math.pow(
    10,
    36 + payoutToken.decimals - quoteToken.decimals
  );

  // The price decimal scaling for a market is split between the price value and the scale value
  // to be able to support a broader range of inputs. Specifically, half of it is in the scale and
  // half in the price. To normalize the price value for display, we can add the half that is in
  // the scale factor back to it.
  const shift = baseScale / Number(marketScale);
  const price = Number(marketPrice) * shift;
  const quoteTokensPerPayoutToken = Number(price) / Math.pow(10, 36);

  // const adjustedQuote = formatUnits(
  //   quoteTokensPerPayoutToken,
  //   quoteToken.decimals
  // );

  const quotePrice = quoteToken.price ?? 0;
  const payoutPrice = payoutToken.price ?? 0;

  const discountedPrice = Number(quoteTokensPerPayoutToken) * quotePrice;

  const _discount = (
    ((discountedPrice - payoutPrice) / payoutPrice) *
    100
  ).toFixed(2);

  //TODO: improve
  const discount = trimAsNumber(-_discount, 2);

  // Reduce maxAmountAccepted by 0.5% to prevent issues due to fee being slightly underestimated in the contract
  // function. See comment on https://github.com/Bond-Protocol/bonds/blob/master/src/bases/BondBaseSDA.sol line 718.
  const maxAccepted =
    (Number(_maxAmountAccepted) - Number(_maxAmountAccepted) * 0.005) /
    Math.pow(10, quoteToken.decimals);

  const [_maxPayout] = marketInfo.slice(-1);

  const maxPayout = formatUnits(BigInt(_maxPayout), payoutToken.decimals);

  const maxPayoutUsd = Number(maxPayout) * payoutPrice;

  const ownerBalance = formatUnits(ownerPayoutBalance, payoutToken.decimals);

  const ownerAllowance = formatUnits(
    ownerPayoutAllowance,
    payoutToken.decimals
  );

  const isCapacityInQuote = markets[4];

  const currentCapacity = formatUnits(
    _currentCapacity,
    isCapacityInQuote ? quoteToken.decimals : payoutToken.decimals
  );

  const capacityToken = isCapacityInQuote ? quoteToken : payoutToken;

  return {
    ...market,
    isLive,
    fullPrice: payoutPrice,
    quoteTokensPerPayoutToken: Number(quoteTokensPerPayoutToken.toString()),
    discountedPrice,
    maxAmountAccepted: maxAccepted.toString(),
    maxPayout,
    maxPayoutUsd,
    ownerBalance,
    ownerAllowance: ownerAllowance.toString(),
    isCapacityInQuote,
    currentCapacity: Number(currentCapacity),
    capacityToken,
    discount,
    formatted: {
      ...formatVestingLabels(market),
      fullPrice: "$" + trimToken(payoutPrice),
      discountedPrice: "$" + trimToken(discountedPrice),
      maxPayoutUsd: usdFullFormatter.format(maxPayoutUsd),
      tbvUsd: usdLongFormatter.format(market.totalBondedAmount * quotePrice),
      quoteTokensPerPayoutToken: trimToken(
        quoteTokensPerPayoutToken.toString()
      ),
    },
  };
}

function createBaseMarket(market: PrecalculatedMarket): CalculatedMarket {
  return {
    ...market,
    marketId: Number(market.id.slice(market.id.lastIndexOf("_") + 1)),
    discount: 0,
    discountedPrice: 0,
    quoteTokensPerPayoutToken: 0,
    fullPrice: 0,
    maxAmountAccepted: "",
    maxPayout: "",
    maxPayoutUsd: 0,
    ownerBalance: "",
    ownerAllowance: "",
    currentCapacity: 0,
    isLive: false,
    tbvUsd: 0,
    creationDate: "",
    isCapacityInQuote: false,
    capacityToken: market.payoutToken,
    blockExplorer: getBlockExplorer(market.chainId),
    formatted: {
      fullPrice: "Unknown",
      discountedPrice: "Unknown",
      tbvUsd: "Unknown",
      maxPayoutUsd: "Unknown",
      shortVesting: "Unknown",
      longVesting: "Unknown",
      quoteTokensPerPayoutToken: "Unknown",
    },
  };
}

/** Formats a bond market vesting date/duration according to vesting type */
function formatVestingLabels(market: CalculatedMarket) {
  if (market.isInstantSwap) {
    return {
      shortVesting: "Instant Swap",
      longVesting: "Immediate Payout",
    };
  }

  if (market.vestingType.includes("term")) {
    const now = new Date();
    const vestingDateFromNow = new Date(now.getTime() + market.vesting * 1000);
    const interval = intervalToDuration({
      start: now,
      end: vestingDateFromNow,
    });

    return {
      longVesting: formatDate.short(new Date()),
      shortVesting: interval.days + " Days",
    };
  }

  const date = new Date(market.vesting * 1000);
  return {
    longVesting: formatDate.long(date),
    shortVesting: formatDate.short(date),
  };
}
