import {Price} from "hooks/useTokens";
import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {useProvider} from "wagmi";
import {providers} from "services/owned-providers";
import {Market} from "src/generated/graphql";

export function useCalculatedMarkets(currentPrices: Map<string, Price[]>, markets: Market[]) {
  const provider = useProvider();
  const [calculatedMarkets, setCalculatedMarkets] = useState(new Map());

  function getPrice(id: string): string {
    const sources = currentPrices.get(id);
    if (!sources) return "";
    for (const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return source.price;
    }
    return "";
  }

  const calculatePrices = useQuery("calculatedMarkets", async () => {
    const requests: Promise<CalculatedMarket>[] = [];
    const calculatedMarketsMap = new Map();
    try {
      if (currentPrices.size > 0 && markets) {
        markets.forEach((market) => {
          const requestProvider = providers[market.network] || provider;

          requests.push(contractLibrary.calcMarket(
            requestProvider,
            import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
            {
              id: market.id,
              auctioneer: market.auctioneer,
              vesting: market.vesting,
              vestingType: market.vestingType,
              payoutToken: {
                id: market.payoutToken.id,
                decimals: market.payoutToken.decimals,
                name: market.payoutToken.name,
                symbol: market.payoutToken.symbol,
                price: getPrice(market.payoutToken.id),
              },
              quoteToken: {
                id: market.quoteToken.id,
                decimals: market.quoteToken.decimals,
                name: market.quoteToken.name,
                symbol: market.quoteToken.symbol,
                price: getPrice(market.payoutToken.id),
              }
            }
          ).then((result: CalculatedMarket) => {
            calculatedMarketsMap.set(result.id, result);
            return result;
          }));
        });
      }
    } catch (e: any) {
      throw new Error("Error loading bond prices", e);
    }

    return Promise.allSettled(requests).then(() => calculatedMarketsMap);
  });

  useEffect(() => {
    if (currentPrices && markets) {
      void calculatePrices.refetch();
    }
  }, [currentPrices, markets]);


  useEffect(() => {
    if (calculatePrices && calculatePrices.data) {
      setCalculatedMarkets(calculatePrices.data);
    }
  }, [calculatePrices.data]);

  return {
    calculatedMarkets: calculatedMarkets,
  };
}
