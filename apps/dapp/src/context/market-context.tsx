import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";
import { CalculatedMarket } from "types";
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
  arePastMarketsLoading: false,
  updatedMarketTokens: false,
  isLoading: {
    market: false,
    tokens: false,
    priceCalcs: false,
    pastMarkets: false,
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
  const { data: markets, isLoading: arePastMarketsLoading } = usePastMarkets();
  const { closedMarkets } = markets;
  const everyMarket = [...calculatedMarkets.allMarkets, ...closedMarkets];

  return (
    <MarketContext.Provider
      value={{
        ...calculatedMarkets,
        arePastMarketsLoading,
        // @ts-ignore
        everyMarket,
        // @ts-ignore
        closedMarkets,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
