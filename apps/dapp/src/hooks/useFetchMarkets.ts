import { Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import {
  calcMarket,
  getMarketData,
  liveMarketsBy,
  CalculatedMarket,
  PrecalculatedMarket, marketCounter,
} from "@bond-protocol/contract-library";
import { CHAIN_ID } from "@bond-protocol/bond-library";

export function useFetchMarkets(
  tokenPrices: Map<string, number>,
  ownerAddress: string,
  referrerAddress: string,
  chainId: string,
  provider: Provider
) {
  const [marketData, setMarketData] = useState<PrecalculatedMarket[]>([]);
  const [calculatedMarkets, setCalculatedMarkets] = useState<
    CalculatedMarket[]
  >([]);

  let isLoading = false;

  const fetchMarketData = async () => {
    if (!isLoading) {
      isLoading = true;

      const count = await marketCounter(provider, chainId);
      const marketIds = await liveMarketsBy(ownerAddress, 0, count, provider, chainId);

      const promises = getMarketData(
        marketIds,
        tokenPrices,
        provider,
        // @ts-ignore
        chainId as CHAIN_ID
      );

      let results: PrecalculatedMarket[];
      Promise.allSettled(promises)
        .then((result) => {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          results = result.map((result) => result.value);
        })
        .catch((reason) => {
          console.log(reason);
          isLoading = false;
        })
        .finally(() => {
          setMarketData(results);
          isLoading = false;
        });
    }
  };

  useEffect(() => {
    if (marketData) {
      const promises: Promise<CalculatedMarket>[] = [];
      marketData.forEach((market) =>
        promises.push(calcMarket(provider, referrerAddress, market))
      );

      void Promise.allSettled(promises).then((result) => {
        // @ts-ignore
        setCalculatedMarkets(result);
      });
    }
  }, [marketData]);

  return {
    fetchMarketData: () => fetchMarketData(),
    markets: calculatedMarkets,
  };
}
