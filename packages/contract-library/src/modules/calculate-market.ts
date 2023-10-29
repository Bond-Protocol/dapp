import { CalculatedMarket, PrecalculatedMarket } from 'types';
import { Address, PublicClient, formatUnits, getContract } from 'viem';
import { Auctioneer, getAuctioneerAbiForName } from 'core';
import { abis } from 'abis';


export async function calculateMarket(
  subgraphMarket: PrecalculatedMarket,
  publicClient: PublicClient,
  referrerAddress: Address = `0x${'0'.repeat(40)}`,
): Promise<CalculatedMarket> {
  const market = createBaseMarket(subgraphMarket);
  const { quoteToken, payoutToken } = market;

  const auctioneerAbi = getAuctioneerAbiForName(market.name as Auctioneer);

  const auctioneerContract = getContract({
    abi: auctioneerAbi,
    address: market.auctioneer,
    publicClient,
  });

  const payoutTokenContract = getContract({
    abi: abis.erc20,
    address: payoutToken.address,
    publicClient,
  });

  const [
    ownerPayoutBalance,
    ownerPayoutAllowance,
    _currentCapacity,
    marketPrice,
    marketScale,
    marketInfo,
    isLive,
    markets,
    maxAmountAccepted,
  ] = await Promise.all([
    payoutTokenContract.read.balanceOf([market.owner]),
    payoutTokenContract.read.allowance([market.owner, market.teller]),
    auctioneerContract.read.currentCapacity([market.marketId]),
    auctioneerContract.read.marketPrice([market.marketId]),
    auctioneerContract.read.marketScale([market.marketId]),
    auctioneerContract.read.getMarketInfoForPurchase([market.marketId]),
    auctioneerContract.read.isLive([market.marketId]),
    auctioneerContract.read.markets([market.marketId]),
    auctioneerContract.read.maxAmountAccepted([
      market.marketId,
      referrerAddress,
    ]),
  ]);

  const baseScale =
    10n ** BigInt(36 + payoutToken.decimals - quoteToken.decimals);

  // The price decimal scaling for a market is split between the price value and the scale value
  // to be able to support a broader range of inputs. Specifically, half of it is in the scale and
  // half in the price. To normalize the price value for display, we can add the half that is in
  // the scale factor back to it.
  const shift = baseScale / marketScale;
  const price = marketPrice * shift;
  const quoteTokensPerPayoutToken = price / 10n ** 36n;

  const discountedPrice = Number(
    quoteTokensPerPayoutToken * BigInt(quoteToken.price),
  );

  const discount =
    ((discountedPrice - payoutToken.price) / payoutToken.price) * 100;

  const maxAccepted =
    (maxAmountAccepted - maxAmountAccepted * BigInt(0.005)) /
    10n ** BigInt(quoteToken.decimals);

  const [_maxPayout] = marketInfo.slice(-1);

  const maxPayout = formatUnits(BigInt(_maxPayout), payoutToken.decimals);

  const maxPayoutUsd =
    payoutToken.price > 0 ? Number(maxPayout) * market.payoutToken.price : 0;

  const ownerBalance = formatUnits(ownerPayoutBalance, payoutToken.decimals);

  const ownerAllowance =
    ownerPayoutAllowance / 10n ** BigInt(payoutToken.decimals);

  const isCapacityInQuote = markets[4];

  const currentCapacity = formatUnits(
    _currentCapacity,
    isCapacityInQuote ? quoteToken.decimals : payoutToken.decimals,
  );

  const capacityToken = isCapacityInQuote ? quoteToken : payoutToken;

  const fullPrice = payoutToken.price;

  return {
    ...market,
    isLive,
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
    fullPrice,
    discount,

  formattedFullPrice: "",
  formattedMaxPayoutUsd: "",
  formattedDiscountedPrice: "",
  formattedShortVesting: "",
  formattedLongVesting: "",
  formattedTbvUsd: "",
    }
}

function createBaseMarket(market: PrecalculatedMarket) {
  return {
    ...market,
    marketId: BigInt(market.id.slice(market.id.lastIndexOf('_') + 1)),
    discount: 0,
    discountedPrice: 0,
    formattedDiscountedPrice: '',
    quoteTokensPerPayoutToken: '',
    fullPrice: 0,
    formattedFullPrice: '',
    maxAmountAccepted: '',
    maxPayout: '',
    maxPayoutUsd: 0,
    ownerBalance: '',
    ownerAllowance: '',
    currentCapacity: 0,
    capacityToken: '',
    isLive: false,
    tbvUsd: 0,
    formattedTbvUsd: '',
    creationDate: '',
  };
}
