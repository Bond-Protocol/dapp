import {Price} from "hooks/useTokens";
import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {useProvider} from "wagmi";
import {providers} from "services/owned-providers";
import {Market} from "src/generated/graphql";

export function useBondPrices(currentPrices: Map<string, Price[]>, markets: Market[]) {
  const provider = useProvider();
  const [bondPrices, setBondPrices] = useState(new Map());

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

  const calculatePrices = useQuery("bondPrices", async () => {
    const requests: Promise<CalculatedMarket>[] = [];
    const bondPricesMap = new Map();
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
            bondPricesMap.set(result.id, result);
            return result;
          }));
        });
      }
    } catch (e: any) {
      throw new Error("Error loading bond prices", e);
    }

    return Promise.allSettled(requests).then(() => bondPricesMap);
  }, {
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  useEffect(() => {
    if (currentPrices && markets) {
      void calculatePrices.refetch();
    }
  }, [currentPrices, markets]);


  useEffect(() => {
    if (calculatePrices && calculatePrices.data) {
      setBondPrices(calculatePrices.data);
    }
  }, [calculatePrices.data]);

  return {
    bondPrices: bondPrices,
  };
}
