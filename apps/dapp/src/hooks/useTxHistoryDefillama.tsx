import { useQuery } from "react-query";
import defillama from "services/defillama";
import { BondPurchase } from "../generated/graphql";

export const useTxHistoryDefillama = (bondPurchases: BondPurchase[]) => {
  const chainId = bondPurchases[0].chainId; //Assume equal chainIds for now

  const { data: chart, ...chartQuery } = useQuery({
    queryKey: `defillama-chart-${bondPurchases[0].payoutToken.symbol}-${bondPurchases[0].quoteToken.symbol}`,
    queryFn: () => defillama.fetchPurchases(bondPurchases),
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
