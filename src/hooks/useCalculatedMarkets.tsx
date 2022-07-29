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

  function getPrice(id: string): number {
    const sources = currentPrices.get(id);
    if (!sources) return 0;
    for (const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return Number(source.price);
    }
    return 0;
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
              network: market.network,
              auctioneer: market.auctioneer,
              teller: market.teller,
              vesting: market.vesting,
              vestingType: market.vestingType,
              payoutToken: {
                id: market.payoutToken.id,
                address: market.payoutToken.address,
                decimals: market.payoutToken.decimals,
                name: market.payoutToken.name,
                symbol: market.payoutToken.symbol,
                price: getPrice(market.payoutToken.id),
              },
              quoteToken: {
                id: market.quoteToken.id,
                address: market.quoteToken.address,
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
