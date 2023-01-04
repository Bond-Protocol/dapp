import { useTokens } from "hooks/useTokens";
import { useQueries } from "react-query";
import { useState } from "react";
import * as bondLibrary from "@bond-protocol/bond-library";
import {
  CHAIN_ID,
  getProtocolByAddress,
} from "@bond-protocol/bond-library";
import * as contractLibrary from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";
import { Market } from "src/generated/graphql";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useLoadMarkets } from "hooks/useLoadMarkets";
import { useMyMarkets } from "hooks/useMyMarkets";

export function useCalculatedMarkets() {
  const { markets: markets, isLoading: isMarketLoading } = useLoadMarkets();

  const { markets: myMarkets, isLoading: isMyMarketLoading } = useMyMarkets();
  const {
    getPrice,
    getTokenDetails,
    currentPrices,
    isLoading: areTokensLoading,
  } = useTokens();
  const [calculatedMarkets, setCalculatedMarkets] = useState(new Map());
  const [myCalculatedMarkets, setMyCalculatedMarkets] = useState(new Map());
  const [issuers, setIssuers] = useState<string[]>([]);
  const [marketsByIssuer, setMarketsByIssuer] = useState(new Map());

  const calculateMarket = async (market: Market) => {
    const requestProvider = providers[market.chainId];
    const obsoleteAuctioneers = [
      "0x007f7a58103a31109f848df1a14f7020e1f1b28a",
      "0x007f7a6012a5e03f6f388dd9f19fd1d754cfc128",
      "0x007fea7a23da99f3ce7ea34f976f32bf79a09c43",
      "0x007fea2a31644f20b0fe18f69643890b6f878aa6",
    ];
    if (obsoleteAuctioneers.includes(market.auctioneer)) return;

    /*
      We cannot rely on the value of isLive from the subgraph, it only updates on events.
      If a market is manually closed, or closes after hitting capacity, the subgraph will
      be updated, and isLive will be false. However, if it hits its expiry date, there is
      no event, so the subgraph is not updated. Thus, we check here and return early if
      the market is not live.
    */
    const isLive = await contractLibrary.isLive(
      market.marketId,
      requestProvider,
      market.chainId
    );
    if (!isLive) return;

    const purchaseLink = bondLibrary.TOKENS.get(
      market.quoteToken.id
    )?.purchaseLinks.get(market.chainId as CHAIN_ID)
      ? bondLibrary.TOKENS.get(market.quoteToken.id)?.purchaseLinks.get(
          market.chainId as CHAIN_ID
        )
      : "https://app.sushi.com/swap";

    const quoteToken = getTokenDetails(market.quoteToken);
    const payoutToken = getTokenDetails(market.payoutToken);

    getPrice(quoteToken.id);
    getPrice(payoutToken.id);

    const lpPair = quoteToken.lpPair;
    if (lpPair != undefined) {
      lpPair.token0.price = getPrice(lpPair.token0.id);
      lpPair.token1.price = getPrice(lpPair.token1.id);
    }

    return contractLibrary
      .calcMarket(
        requestProvider,
        import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
        {
          id: market.id,
          chainId: market.chainId,
          auctioneer: market.auctioneer,
          teller: market.teller,
          owner: market.owner,
          vesting: market.vesting,
          vestingType: market.vestingType,
          isInstantSwap: market.isInstantSwap,
          totalBondedAmount: market.totalBondedAmount,
          totalPayoutAmount: market.totalPayoutAmount,
          creationBlockTimestamp: market.creationBlockTimestamp,
          payoutToken: {
            id: payoutToken.id,
            address: payoutToken.address,
            decimals: payoutToken.decimals,
            name: payoutToken.name,
            symbol: payoutToken.symbol,
            price: getPrice(payoutToken.id),
          },
          quoteToken: {
            id: quoteToken.id,
            address: quoteToken.address,
            decimals: quoteToken.decimals,
            name: quoteToken.name,
            symbol: quoteToken.symbol,
            price: getPrice(quoteToken.id),
            lpPair: quoteToken.lpPair,
            purchaseLink: purchaseLink,
          },
        }, //@ts-ignore
        bondLibrary.TOKENS.get(market.quoteToken.id)
          ? bondLibrary.LP_TYPES.get(
              // @ts-ignore
              bondLibrary.TOKENS.get(market.quoteToken.id)?.lpType
            )
          : undefined
      )
      .then((result: CalculatedMarket) => result)
      .catch((e) => {
        console.log("catch", e);
      });
  };

  const calculateAllMarkets = useQueries(
    markets.map((market) => {
      return {
        queryKey: market.id,
        queryFn: () => calculateMarket(market),
        enabled: Object.keys(currentPrices).length > 0,
      };
    })
  );

  const calculateMyMarkets = useQueries(
    myMarkets.map((market) => {
      return {
        queryKey: market.id,
        queryFn: () => calculateMarket(market),
        enabled: Object.keys(currentPrices).length > 0,
      };
    })
  );

  const isCalculatingAll = calculateAllMarkets.some((m) => m.isLoading);
  const isCalculatingMine = calculateMyMarkets.some((m) => m.isLoading);

  const refetchOne = (id: string) => {
    calculateAllMarkets.forEach((result) => {
      if (result.data && result.data.id === id) void result.refetch();
    });

    const market = calculateAllMarkets.find((m) => m?.data?.id === id);
    void market?.refetch();
  };

  const refetchAllMarkets = () => {
    calculateAllMarkets.forEach((result) => result.refetch());
  };

  const refetchMyMarkets = () => {
    calculateMyMarkets.forEach((result) => result.refetch());
  };

  useDeepCompareEffect(() => {
    if (!isCalculatingAll && Object.keys(currentPrices).length > 0) {
      const calculatedMarketsMap = new Map();
      const issuerMarkets = new Map();

      calculateAllMarkets.forEach((result) => {
        if (result && result.data) {
          calculatedMarketsMap.set(result.data.id, result.data);

          const protocol = getProtocolByAddress(result.data.owner, result?.data.chainId);
          const id = protocol?.id;
          const value = issuerMarkets.get(protocol?.id) || [];

          value.push(result.data);
          issuerMarkets.set(id, value);
        }
      });

      setCalculatedMarkets(calculatedMarketsMap);
      setIssuers(Array.from(issuerMarkets.keys()));
      setMarketsByIssuer(issuerMarkets);
    }
  }, [calculateAllMarkets, currentPrices]);

  useDeepCompareEffect(() => {
    if (!isCalculatingMine && Object.keys(currentPrices).length > 0) {
      const calculatedMarketsMap = new Map();
      calculateMyMarkets.forEach((result) => {
        result.data && calculatedMarketsMap.set(result.data.id, result.data);
      });

      setMyCalculatedMarkets(calculatedMarketsMap);
    }
  }, [calculateMyMarkets, currentPrices]);

  return {
    allMarkets: calculatedMarkets,
    myMarkets: myCalculatedMarkets,
    issuers: issuers,
    marketsByIssuer: marketsByIssuer,
    isMarketOwner: !!myCalculatedMarkets.size,
    refetchAllMarkets: () => refetchAllMarkets(),
    refetchMyMarkets: () => refetchMyMarkets(),
    refetchOne: (id: string) => refetchOne(id),
    getTokenDetails,
    getPrice,
    isLoading: {
      market: isMarketLoading,
      myMarkets: isMyMarketLoading,
      tokens: areTokensLoading,
      priceCalcs: isCalculatingAll,
      myPriceCalcs: isCalculatingMine,
    },
  };
}
