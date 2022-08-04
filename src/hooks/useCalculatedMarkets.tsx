import {useTokens} from "hooks/useTokens";
import {useQueries} from "react-query";
import {useEffect, useState} from "react";
import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {useProvider} from "wagmi";
import {providers} from "services/owned-providers";
import {Market} from "src/generated/graphql";
import useDeepCompareEffect from "use-deep-compare-effect";
import {useMarkets} from "hooks/useMarkets";
import {useMyMarkets} from "hooks/useMyMarkets";

export function useCalculatedMarkets() {
  const {markets: markets} = useMarkets();
  const {markets: myMarkets} = useMyMarkets();
  const currentPrices = useTokens().currentPrices;
  const provider = useProvider();
  const [calculatedMarkets, setCalculatedMarkets] = useState(new Map());
  const [myCalculatedMarkets, setMyCalculatedMarkets] = useState(new Map());

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

  const calculateMarket = (market: Market) => {
    const requestProvider = providers[market.network] || provider;
    return contractLibrary.calcMarket(
      requestProvider,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
      {
        id: market.id,
        network: market.network,
        auctioneer: market.auctioneer,
        teller: market.teller,
        vesting: market.vesting,
        vestingType: market.vestingType,
        isLive: market.isLive,
        isInstantSwap: market.isInstantSwap,
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
    ).then((result: CalculatedMarket) => result);
  };

  const calculateAllMarkets = useQueries(
    markets.map(market => {
      return {
        queryKey: market.id,
        queryFn: () => calculateMarket(market),
        enabled: markets && currentPrices && currentPrices.size > 0
      };
    })
  );

  const calculateMyMarkets = useQueries(
    myMarkets.map(market => {
      return {
        queryKey: market.id,
        queryFn: () => calculateMarket(market),
        enabled: myMarkets && currentPrices && currentPrices.size > 0
      };
    })
  );

  const refetchOne = (id: string) => {
    calculateAllMarkets.forEach((result) => {
      if (result.data && result.data.id === id) result.refetch();
    });
  };

  const refetchAllMarkets = () => {
    calculateAllMarkets.forEach((result) => result.refetch());
  };

  const refetchMyMarkets = () => {
    calculateMyMarkets.forEach((result) => result.refetch());
  };

  useDeepCompareEffect(() => {
    const calculatedPricesMap = new Map();
    calculateAllMarkets.forEach((result) => {
      result.data && calculatedPricesMap.set(result.data.id, result.data);
    });

    setCalculatedMarkets(calculatedPricesMap);
  }, [calculateAllMarkets]);

  useDeepCompareEffect(() => {
    const calculatedPricesMap = new Map();
    calculateMyMarkets.forEach((result) => {
      result.data && calculatedPricesMap.set(result.data.id, result.data);
    });

    setMyCalculatedMarkets(calculatedPricesMap);
  }, [calculateMyMarkets]);

  return {
    allMarkets: calculatedMarkets,
    myMarkets: myCalculatedMarkets,
    refetchAllMarkets: () => refetchAllMarkets(),
    refetchMyMarkets: () => refetchMyMarkets(),
    refetchOne: (id: string) => refetchOne(id),
  };
}
