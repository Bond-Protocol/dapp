import {getSubgraphQuery, providers} from "services";
import {
  calcMarket,
  CalculatedMarket,
  liveMarketsBy,
  liveMarketsFor,
  marketCounter
} from "@bond-protocol/contract-library";
import {Market, useGetMarketsByIdQuery} from "../generated/graphql";
import {getTokenDetails} from "../utils";
import {useTokens} from "context/token-context";
import {useEffect, useState} from "react";

export function useGetMarkets() {
  const { getPrice, currentPrices } = useTokens();
  const [chain, setChain] = useState<string>("");
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const [markets, setMarkets] = useState<CalculatedMarket[]>([]);

  const {data} = getSubgraphQuery(
    useGetMarketsByIdQuery,
    chain,
    true,
    { marketIds: marketIds }
  );

  useEffect(() => {
    if (!data || Object.keys(currentPrices).length === 0) return;
    const results = data.markets;

    const promises: Promise<CalculatedMarket>[] = [];
    results.forEach((market: Market) => {
      // @ts-ignore
      promises.push(calculateMarket(market));
    });

    const calculatedMarkets: CalculatedMarket[] = [];
    Promise.allSettled(promises).then((value) => {
      value.forEach((val) => {
        calculatedMarkets.push(val.value);
      });
    });

    setMarkets(calculatedMarkets);
  }, [data, currentPrices]);

  const calculateMarket = async (market: Market) => {
    const requestProvider = providers[market.chainId];

    const quoteToken = getTokenDetails(market.quoteToken);
    const payoutToken = getTokenDetails(market.payoutToken);

    const lpPair = quoteToken.lpPair;
    if (lpPair != undefined) {
      lpPair.token0.price = getPrice(lpPair.token0.id);
      lpPair.token1.price = getPrice(lpPair.token1.id);
    }

    return calcMarket(
        requestProvider,
        import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
        {
          ...market,
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
            purchaseLink: "",
          },
        },
      )
      .then((result: CalculatedMarket) => ({
        ...result,
        start: market.start,
        conclusion: market.conclusion,
      }))
      .catch((e) => {
        console.log("catch", e);
      });
  };

  const getLiveMarketsForToken = async (
    tokenAddress: string,
    isPayout: boolean,
    chainId: string
  ) => {
    setChain(chainId);

    const provider = providers[chainId];
    const results = await liveMarketsFor(
      tokenAddress,
      isPayout,
      provider,
      chainId
    );

    const res: number[] = [];
    results.forEach(result => res.push(Number(result)));

    setMarketIds(res);
  }

  const getLiveMarketsByOwner = async (
    ownerAddress: string,
    chainId: string
  ) => {
    setChain(chainId);
    const provider = providers[chainId];

    const marketCount = await marketCounter(
      provider,
      chainId
    );

    const results = await liveMarketsBy(
      ownerAddress,
      0,
      marketCount,
      provider,
      chainId
    );

    const res: number[] = [];
    results.forEach(result => res.push(Number(result)));

    setMarketIds(res);
  }

  return {
    getLiveMarketsForToken,
    getLiveMarketsByOwner,
    markets,
  }
}
