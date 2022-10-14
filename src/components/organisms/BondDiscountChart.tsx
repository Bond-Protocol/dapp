import { LineChart } from "./LineChart";
import { prices, discounts } from "../../utils/mock-data";

const data = [
  { label: "Price", data: discounts },
  { label: "Discount", data: prices },
];

export const BondDiscountChart = () => {
  return <LineChart data={data} />;
};
