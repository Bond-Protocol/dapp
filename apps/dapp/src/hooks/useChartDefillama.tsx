import { useQuery } from "react-query";
import type { Token } from "types";
import defillama from "services/defillama";

export const useChartDefillama = (
  tokens: { address: string; chainId: number }[],
  days = 7,
  start?: number
) => {
  const enabled = tokens.every((t) => !!t.address && !!t.chainId);
  const queryIds = enabled
    ? tokens.map(defillama.utils.toDefillamaQueryId)
    : "";
  const chainId = tokens[0].chainId; //Assume equal chainIds for now

  const { data: chart, ...chartQuery } = useQuery({
    queryKey: `defillama-chart-${queryIds}-${days}d`,
    queryFn: () => defillama.fetchChart(queryIds, { chainId, days, start }),
    enabled,
  });

  const isValid =
    chartQuery.isSuccess &&
    !!chart?.[0]?.prices?.length &&
    !!chart?.[1]?.prices?.length;

  const updatedCharts =
    chart?.map((t) => ({
      ...t,
      prices: t.prices?.map((p) => ({
        ...p,
        timestamp: p.timestamp * 1000, //current charts expect date instead of timestamp :sad:
      })),
    })) ?? [];

  return {
    chart: updatedCharts.reverse(), //smh they get swapped so we swap them back
    isValid,
    isLoading: chartQuery.isLoading,
  };
};
