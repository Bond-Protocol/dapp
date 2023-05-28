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
      const [payoutRes, quoteRes] = chart;
      const updated = payoutRes.prices?.map((p, i) => {
        const quotePrice = quoteRes.prices[i]?.price;
        return {
          ...p,
          date: p.timestamp * 1000,
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
