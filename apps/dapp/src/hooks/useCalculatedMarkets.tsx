import { CalculatedMarket, PrecalculatedMarket } from "types";
import {
  Address,
  PublicClient,
  formatUnits,
  getContract,
  parseUnits,
} from "viem";
import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import {
  Auctioneer,
  getAuctioneerAbiForName,
  abis,
} from "@bond-protocol/contract-library";
import { Market } from "src/generated/graphql";
import { useTokens } from "hooks";
import { useSubgraph } from "hooks/useSubgraph";
import { usePublicClient } from "wagmi";
import {
  formatCurrency,
  formatDate,
  trimAsNumber,
  usdFullFormatter,
} from "formatters";
import { clients } from "context/blockchain-provider";

const FEE_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

export function useCalculatedMarkets() {
  const { tokens, getByAddress, fetchedExtendedDetails } = useTokens();
  const { markets, isLoading: isMarketLoading } = useSubgraph();
  const [calculatedMarkets, setCalculatedMarkets] = useState<
    CalculatedMarket[]
  >([]);
  const publicClient = usePublicClient();

  const calcMarket = async (market: Market) => {
    const obsoleteAuctioneers = [
      "0x007f7a58103a31109f848df1a14f7020e1f1b28a",
      "0x007f7a6012a5e03f6f388dd9f19fd1d754cfc128",
      "0x007fea7a23da99f3ce7ea34f976f32bf79a09c43",
      "0x007fea2a31644f20b0fe18f69643890b6f878aa6",
    ];
    if (obsoleteAuctioneers.includes(market.auctioneer)) return;

    const quoteToken = getByAddress(market.quoteToken.address);
    const payoutToken = getByAddress(market.payoutToken.address);

    let updatedMarket = { ...market, quoteToken, payoutToken };

    //@ts-ignore
    const publicClient = clients[Number(market.chainId)];

    try {
      const result = await calculateMarket(
        //@ts-ignore
        updatedMarket,
        publicClient,
        FEE_ADDRESS
      );

      return { ...result, start: market.start, conclusion: market.conclusion };
    } catch (e) {
      console.log(
        `ProtocolError: Failed to calculate market ${market.id} \n`,
        e
      );
      console.log(market);
      return market;
    }
  };

  const calculateAllMarkets = useQueries(
    markets.map((market: Market) => ({
      queryKey: market.id,
      queryFn: () => calcMarket(market),
      enabled: tokens.length > 0,
    }))
  );

  const isCalculatingAll = calculateAllMarkets.some((m) => m.isLoading);

  const refetchOne = (id: string) => {
    const market = calculateAllMarkets.find((m) => m?.data?.id === id);
    market?.refetch();
  };

  const refetchAllMarkets = () => {
    calculateAllMarkets.forEach((result) => result.refetch());
  };

  useDeepCompareEffect(() => {
    if (!isCalculatingAll && Object.keys(tokens).length > 0) {
      const markets = calculateAllMarkets
        .filter((result) => result && result?.data)
        .map((r) => r.data)
        //@ts-ignore
        .map((market: CalculatedMarket) => {
          const quoteToken =
            getByAddress(market.quoteToken.address) || market.quoteToken;
          const payoutToken =
            getByAddress(market.payoutToken.address) || market.payoutToken;

          return {
            ...market,
            quoteToken,
            payoutToken,
          };
        });

      setCalculatedMarkets(markets);
    }
  }, [calculateAllMarkets, tokens]);

  useEffect(() => {
    const marketsExist = Boolean(calculatedMarkets.length);
    const tokensHaveLogos = tokens.some((t) => Boolean(t.logoURI));
    const marketTokensDontHaveLogos = calculatedMarkets.every(
      (m) =>
        m.quoteToken.logoURI?.includes("placeholder") ||
        m.payoutToken.logoURI?.includes("placeholder")
    );

    if (marketsExist && tokensHaveLogos && marketTokensDontHaveLogos) {
      const updatedMarkets = calculatedMarkets.map(
        (market: CalculatedMarket) => {
          const quoteToken =
            getByAddress(market.quoteToken.address) || market.quoteToken;
          const payoutToken =
            getByAddress(market.payoutToken.address) || market.payoutToken;

          return {
            ...market,
            quoteToken,
            payoutToken,
          };
        }
      );

      setCalculatedMarkets(updatedMarkets);
    }
  }, [calculatedMarkets.length, tokens, fetchedExtendedDetails]);

  const isLoading = {
    market: isMarketLoading,
    priceCalcs: isCalculatingAll,
  };

  const isSomeLoading = () => Object.values(isLoading).some((x) => x);
  return {
    allMarkets: calculatedMarkets,
    getMarketsForOwner: (address: string) =>
      calculatedMarkets.filter(
        (market: CalculatedMarket) =>
          market.owner.toLowerCase() === address?.toLowerCase()
      ),
    getByChainAndId: (chainId: number | string, id: number | string) =>
      calculatedMarkets.find(
        ({ marketId, chainId: marketChainId }) =>
          marketId.toString() === id && marketChainId === chainId
      ),
    refetchAllMarkets,
    refetchOne,
    isSomeLoading,
    isLoading: {
      market: isMarketLoading,
      priceCalcs: isCalculatingAll,
    },
  };
}

export async function calculateMarket(
  subgraphMarket: PrecalculatedMarket,
  publicClient: PublicClient,
  referrerAddress: Address = `0x${"0".repeat(40)}`
): Promise<CalculatedMarket> {
  const market = createBaseMarket(subgraphMarket);
  const { quoteToken, payoutToken } = market;

  if (!quoteToken.price || !payoutToken.price) return market;
  const auctioneerAbi = getAuctioneerAbiForName(market.name as Auctioneer);

  const auctioneerContract = getContract({
    abi: auctioneerAbi,
    address: market.auctioneer as Address,
    publicClient,
  });

  const payoutTokenContract = getContract({
    abi: abis.erc20,
    address: payoutToken.address as Address,
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
  const quoteTokensPerPayoutToken = Number(price) / Math.pow(10, 36);

  // const adjustedQuote = formatUnits(
  //   quoteTokensPerPayoutToken,
  //   quoteToken.decimals
  // );

  const discountedPrice = Number(quoteTokensPerPayoutToken) * quoteToken.price;
  console.log(market.id, {
    marketPrice,
    discountedPrice,
    price,
    quoteTokensPerPayoutToken,
    //adjustedQuote,
  });

  const _discount = (
    ((discountedPrice - payoutToken.price) / payoutToken.price) *
    100
  ).toFixed(2);

  //TODO: improve
  const discount = trimAsNumber(-_discount, 2);

  const maxAccepted = parseUnits(
    (Number(maxAmountAccepted) - Number(maxAmountAccepted) * 0.005).toString(),
    quoteToken.decimals
  );

  const [_maxPayout] = marketInfo.slice(-1);

  const maxPayout = formatUnits(BigInt(_maxPayout), payoutToken.decimals);

  const maxPayoutUsd = Number(maxPayout) * payoutToken.price;

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

  const fullPrice = payoutToken.price;

  return {
    ...market,
    isLive,
    fullPrice,
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
      fullPrice: "$" + formatCurrency.trimToken(fullPrice),
      discountedPrice: "$" + formatCurrency.trimToken(discountedPrice),
      maxPayoutUsd: usdFullFormatter.format(maxPayoutUsd),
      tbvUsd: usdFullFormatter.format(
        market.totalBondedAmount * quoteToken.price
      ),
      shortVesting: market.isInstantSwap
        ? "Immediate"
        : formatDate.short(new Date(market.vesting * 1000)),
      longVesting: market.isInstantSwap
        ? "Immediate Payout"
        : formatDate.long(new Date(market.vesting * 1000)),
    },
  };
}

function createBaseMarket(market: PrecalculatedMarket): CalculatedMarket {
  return {
    ...market,
    capacityToken: market.payoutToken,
    marketId: BigInt(market.id.slice(market.id.lastIndexOf("_") + 1)),
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
    formatted: {
      fullPrice: "Unknown",
      discountedPrice: "Unknown",
      tbvUsd: "Unknown",
      maxPayoutUsd: "Unknown",
      shortVesting: "Unknown",
      longVesting: "Unknown",
    },
  };
}
