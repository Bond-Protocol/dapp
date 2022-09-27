//@ts-nocheck
import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { createContext, useContext } from "react";

const initialState = {
  allMarkets: new Map(),
  myMarkets: new Map(),
  marketsByIssuer: new Map(),
  issuers: [],
  isMarketOwner: false,
  refetchAllMarkets: () => {},
  refetchMyMarkets: () => {},
  refetchOne: () => {},
};

export const MarketContext = createContext(initialState);

export const useMarkets = () => {
  const markets = useContext(MarketContext);
  return markets;
};

export const MarketProvider = ({ children }: { children: React.ReactNode }) => {
  const calculatedMarkets = useCalculatedMarkets();

  return (
    <MarketContext.Provider value={calculatedMarkets}>
      {children}
    </MarketContext.Provider>
  );
};
