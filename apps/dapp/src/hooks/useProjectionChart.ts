import { useEffect, useState } from "react";
import { useCoingeckoTokenHistory } from "./useTokenPricesHistory";

export const useProjectionChartData = ({ quoteToken, payoutToken, dayRange }: any) => {
  const [prices, setPrices] = useState([]);
  const quoteRes = useCoingeckoTokenHistory(quoteToken, dayRange);
  const payoutRes = useCoingeckoTokenHistory(payoutToken, dayRange);

  useEffect(() => {
    if (!quoteToken || !payoutToken) return;

    if (quoteRes.prices && payoutRes.prices) {
      //@ts-ignore
      const updated = payoutRes.prices?.map((p, i) => {
        const quotePrice = quoteRes.prices[i]?.price;
        return {
          ...p,
          price: 1 / (quotePrice / p.price),
          payoutPriceUsd: p.price,
          quotePriceUsd: quotePrice,
        };
      });

      setPrices(updated);
    } else {
      setPrices([]);
    }
  }, [quoteToken, payoutToken, quoteRes.isLoading, payoutRes.isLoading]);

  return { prices };
};
