import { LineChart } from "./LineChart";
import { useBondAnalytics } from "hooks/useBondAnalytics";
import { CalculatedMarket } from "@bond-protocol/contract-library";

export type BondDiscountChartProps = {
  market: CalculatedMarket;
};

export const BondDiscountChart = ({ market }: BondDiscountChartProps) => {
  const bondAnalyticsData = useBondAnalytics(market);

  return <LineChart data={bondAnalyticsData} />;
};
