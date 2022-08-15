import {useTokens} from "hooks/useTokens";
import {useQueries} from "react-query";
import {useState} from "react";
import * as bondLibrary from "@bond-labs/bond-library";
import * as contractLibrary from "@bond-labs/contract-library";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {useProvider} from "wagmi";
import {providers} from "services/owned-providers";
import {Market} from "src/generated/graphql";
import useDeepCompareEffect from "use-deep-compare-effect";
import {useMarkets} from "hooks/useMarkets";
import {useMyMarkets} from "hooks/useMyMarkets";
import {getProtocolByAddress} from "@bond-labs/bond-library";

export function useCalculatedMarkets() {
  const {markets: markets} = useMarkets();
  const {markets: myMarkets} = useMyMarkets();
  const {currentPrices, getPrice} = useTokens();
  const provider = useProvider();

  const [calculatedMarkets, setCalculatedMarkets] = useState(new Map());
  const [myCalculatedMarkets, setMyCalculatedMarkets] = useState(new Map());
  const [issuers, setIssuers] = useState<string[]>([]);
  const [marketsByIssuer, setMarketsByIssuer] = useState(new Map());

  const calculateMarket = (market: Market) => {
    const requestProvider = providers[market.network] || provider;
    const lpPair = market.quoteToken.lpPair;
    if (lpPair != undefined) {
      lpPair.token0.price = getPrice(lpPair.token0.id);
      lpPair.token1.price = getPrice(lpPair.token1.id);
    }
    return contractLibrary.calcMarket(
      requestProvider,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS,
      {
        id: market.id,
        network: market.network,
        auctioneer: market.auctioneer,
        teller: market.teller,
        owner: market.owner,
        vesting: market.vesting,
        vestingType: market.vestingType,
        isLive: market.isLive,
        isInstantSwap: market.isInstantSwap,
        totalBondedAmount: market.totalBondedAmount,
        totalPayoutAmount: market.totalPayoutAmount,
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
          price: getPrice(market.quoteToken.id),
          lpPair: market.quoteToken.lpPair,
        }
      },
      bondLibrary.TOKENS.get(market.quoteToken.id) ?
        bondLibrary.LP_TYPES.get(bondLibrary.TOKENS.get(market.quoteToken.id)?.lpType) :
        null,
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
      if (result.data && result.data.id === id) void result.refetch();
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
    const issuerMarkets = new Map();

    calculateAllMarkets.forEach((result) => {
      if (result && result.data) {
        calculatedPricesMap.set(result.data.id, result.data);

        const protocol = getProtocolByAddress(result.data.owner, result.data.network);
        const id = protocol?.id;
        const value = issuerMarkets.get(protocol?.id) || [];
        value.push(result.data);
        issuerMarkets.set(id, value);
      }
    });

    setCalculatedMarkets(calculatedPricesMap);
    setIssuers(Array.from(issuerMarkets.keys()));
    setMarketsByIssuer(issuerMarkets);
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
    issuers: issuers,
    marketsByIssuer: marketsByIssuer,
    refetchAllMarkets: () => refetchAllMarkets(),
    refetchMyMarkets: () => refetchMyMarkets(),
    refetchOne: (id: string) => refetchOne(id),
  };
}
