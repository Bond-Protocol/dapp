import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";

const initialState = {
  allMarkets: new Map(),
  marketsByIssuer: new Map(),
  issuers: [],
  isMarketOwner: false,
  isLoading: {
    market: false,
    myMarkets: false,
    tokens: false,
    priceCalcs: false,
    myPriceCalcs: false,
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
