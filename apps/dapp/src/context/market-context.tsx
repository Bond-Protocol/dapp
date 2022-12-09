import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";

const initialState = {
  allMarkets: new Map(),
  myMarkets: new Map(),
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
  refetchMyMarkets: () => {},
  refetchOne: (id: string) => {},
};

export const MarketContext = createContext(initialState);

export const useMarkets = () => {
  const markets = useContext(MarketContext);
  return markets;
};

export const MarketProvider = ({ children }: { children: React.ReactNode }) => {
  const calculatedMarkets = useCalculatedMarkets();
  console.log({ calculatedMarkets });

  return (
    // @ts-ignore
    <MarketContext.Provider value={calculatedMarkets}>
      {children}
    </MarketContext.Provider>
  );
};
