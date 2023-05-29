import { useQuery } from "react-query";
import type { Token } from "@bond-protocol/contract-library";
import defillama from "services/defillama";

export const useChartDefillama = (tokens: Token[], dayRange = 7) => {
  const enabled = tokens.every((t) => !!t.address && !!t.chainId);
  const queryIds = enabled
    ? tokens.map(defillama.utils.toDefillamaQueryId)
    : "";

  const { data: chart, ...chartQuery } = useQuery({
    queryKey: `defillama-chart-${queryIds}-${dayRange}d`,
    queryFn: () =>
      defillama.fetchChart(queryIds, { days: dayRange, to: Date.now() }),
    enabled,
  });

  const isValid =
    chartQuery.isSuccess &&
    !!chart?.[0].prices?.length &&
    !!chart?.[1].prices?.length;

  return {
    chart:
      chart?.map((t) => ({
        ...t,
        prices: t.prices?.map((p) => ({
          ...p,
          date: p.timestamp,
        })),
      })) ?? [],
    isValid,
    isLoading: chartQuery.isLoading,
  };
};
