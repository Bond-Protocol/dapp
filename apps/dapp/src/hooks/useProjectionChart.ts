import { useEffect, useState } from "react";
import { useChartDefillama } from "./useChartDefillama";

export const useProjectionChartData = ({
  quoteToken,
  payoutToken,
  dayRange,
}: any) => {
  const [prices, setPrices] = useState<any>([]);
  const { chart, isValid } = useChartDefillama(
    [quoteToken, payoutToken],
    dayRange
  );

  useEffect(() => {
    if (isValid) {
      const quote = chart.find((t) => t.address === quoteToken.address)!;
      const payout = chart.find((t) => t.address === payoutToken.address)!;

      const updated = payout.prices?.map((p, i) => {
        const quotePrice = quote.prices[i]?.price;
        return {
          ...p,
          timestamp: p.timestamp,
          price: 1 / (quotePrice / p.price),
          payoutPriceUsd: p.price,
          quotePriceUsd: quotePrice,
        };
      });

      setPrices(updated);
    }
  }, [isValid]);

  return { prices };
};
