import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";

const initialState = {
  allMarkets: [],
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

  return (
    // @ts-ignore
    <MarketContext.Provider value={calculatedMarkets}>
      {children}
    </MarketContext.Provider>
  );
};
