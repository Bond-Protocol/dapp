import { useCalculatedMarkets } from "hooks/useCalculatedMarkets";
import { usePastMarkets } from "hooks/usePastMarkets";

export const useMarkets = () => {
  const calculatedMarkets = useCalculatedMarkets();

  const { data: markets, isLoading: arePastMarketsLoading } = usePastMarkets();

  const { closedMarkets } = markets;

  const everyMarket = [...calculatedMarkets.allMarkets, ...closedMarkets];

  return {
    ...calculatedMarkets,
    arePastMarketsLoading,
    everyMarket,
    closedMarkets,
  };
};
