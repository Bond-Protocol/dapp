import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { usePastMarkets } from "hooks/usePastMarkets";

const initialState = {
  allMarkets: [] as CalculatedMarket[],
  closedMarkets: [],
  everyMarket: [] as CalculatedMarket[],
  getMarketsForOwner: (address: string) => ({} as CalculatedMarket[]),
  getByChainAndId: (chain: string | number, id: string | number) =>
    ({} as CalculatedMarket),
  isMarketOwner: false,
  isSomeLoading: false,
  updatedMarketTokens: false,
  isLoading: {
    market: false,
    tokens: false,
    priceCalcs: false,
  },
  refetchAllMarkets: () => {},
  refetchOne: (id: string) => {},
};

export const MarketContext = createContext(initialState);

export const useMarkets = () => {
  return useContext(MarketContext);
};

export const MarketProvider = ({ children }: { children: React.ReactNode }) => {
  const calculatedMarkets = useCalculatedMarkets();
  const { markets: closedMarkets } = usePastMarkets();
  const everyMarket = [...calculatedMarkets.allMarkets, ...closedMarkets];

  return (
    <MarketContext.Provider
      // @ts-ignore
      value={{ ...calculatedMarkets, everyMarket, closedMarkets }}
    >
      {children}
    </MarketContext.Provider>
  );
};
