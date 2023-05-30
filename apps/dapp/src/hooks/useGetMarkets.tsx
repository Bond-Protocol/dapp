import { getSubgraphQuery, providers } from "services";
import {
  calcMarket,
  CalculatedMarket,
  findMarketFor,
  getChainId,
  liveMarketsBy,
  liveMarketsFor,
  marketCounter,
  marketsFor,
} from "@bond-protocol/contract-library";
import { Market, useGetMarketsByIdQuery } from "../generated/graphql";
import { useTokens } from "context/token-context";
import { useEffect, useState } from "react";
import { Provider } from "@wagmi/core";

export function useGetMarkets() {
  const { getPrice, currentPrices } = useTokens();
  const [chain, setChain] = useState<string>("");
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const [markets, setMarkets] = useState<CalculatedMarket[]>([]);

  const { data } = getSubgraphQuery(useGetMarketsByIdQuery, chain, true, {
    marketIds: marketIds,
  });

  useEffect(() => {
    if (!data || !currentPrices || Object.keys(currentPrices).length === 0)
      return;
    const results = data.markets;

    const promises: Promise<CalculatedMarket>[] = [];
    results.forEach((market: Market) => {
      // @ts-ignore
      promises.push(calculateMarket(market));
    });

    const calculatedMarkets: CalculatedMarket[] = [];
    Promise.allSettled(promises).then((value) => {
      value.forEach((val) => {
        // @ts-ignore
        calculatedMarkets.push(val.value);
      });
    });

    setMarkets(calculatedMarkets);
  }, [data, currentPrices]);

  const calculateMarket = async (market: Market) => {
    const requestProvider = providers[market.chainId];

    const quoteToken = market.quoteToken;
    const payoutToken = market.payoutToken;

    return calcMarket(
      requestProvider,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
      {
        ...market,
        payoutToken: {
          id: payoutToken.id,
          chainId: market.chainId,
          address: payoutToken.address,
          decimals: payoutToken.decimals,
          name: payoutToken.name,
          symbol: payoutToken.symbol,
          price: getPrice(payoutToken.id),
        },
        quoteToken: {
          id: quoteToken.id,
          chainId: market.chainId,
          address: quoteToken.address,
          decimals: quoteToken.decimals,
          name: quoteToken.name,
          symbol: quoteToken.symbol,
          price: getPrice(quoteToken.id),
          purchaseLink: "",
        },
      }
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
    provider: Provider
  ) => {
    const chainId = await getChainId(provider);
    setChain(chainId);

    const results = await liveMarketsFor(tokenAddress, isPayout, provider);

    const res: number[] = [];
    results.forEach((result) => res.push(Number(result)));

    setMarketIds(res);
  };

  const getLiveMarketsByOwner = async (
    ownerAddress: string,
    provider: Provider
  ) => {
    const chainId = await getChainId(provider);
    setChain(chainId);

    const marketCount = await marketCounter(provider);

    const results = await liveMarketsBy(ownerAddress, 0, marketCount, provider);

    const res: number[] = [];
    results.forEach((result) => res.push(Number(result)));

    setMarketIds(res);
  };

  const getLiveMarketsForPayoutAndQuote = async (
    payoutTokenAddress: string,
    quoteTokenAddress: string,
    provider: Provider
  ) => {
    const chainId = await getChainId(provider);
    setChain(chainId);

    const results = await marketsFor(
      payoutTokenAddress,
      quoteTokenAddress,
      provider
    );

    const res: number[] = [];
    results.forEach((result) => res.push(Number(result)));

    setMarketIds(res);
  };

  const findLiveMarketForPayoutAndQuote = async (
    payoutTokenAddress: string,
    quoteTokenAddress: string,
    amountIn: string,
    minAmountOut: string,
    maxExpiryTimestamp: string,
    provider: Provider
  ) => {
    const chainId = await getChainId(provider);
    setChain(chainId);

    const result = await findMarketFor(
      payoutTokenAddress,
      quoteTokenAddress,
      amountIn,
      minAmountOut,
      maxExpiryTimestamp,
      provider
    );

    setMarketIds([Number(result)]);
  };

  return {
    getLiveMarketsForToken,
    getLiveMarketsByOwner,
    getLiveMarketsForPayoutAndQuote,
    findLiveMarketForPayoutAndQuote,
    markets,
  };
}
