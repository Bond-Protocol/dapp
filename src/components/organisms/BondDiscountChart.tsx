import { LineChart } from "./LineChart";
import { prices, discounts } from "../../utils/mock-data";

const dataset = prices.map((p, i) => {
  return { date: p.date, price: p.price, discount: discounts[i].price };
});

export const BondDiscountChart = () => {
  return <LineChart data={dataset} />;
};
