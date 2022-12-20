import { format } from "date-fns";
import { BondChartDataset } from "components/organisms/LineChart";
import { dynamicFormatter } from "src/utils/format";

const getDiscountColor = (price: number, discount: number) => {
  if (price === discount) return "text-white";
  return price > discount ? "text-light-success" : "text-red-400";
};

type ChartTooltipProps = {
  tokenSymbol: string;
  payload?: Array<{ payload: BondChartDataset }>;
};

const TooltipLabel = (props: {
  value: string;
  label: string;
  className: string;
  valueClassName?: string;
}) => {
  return (
    <div className={`flex w-full justify-between ${props.className}`}>
      <p className="w-1/2">{props.label}</p>
      <p className={`text-left text-white ${props.valueClassName}`}>
        {props.value}
      </p>
    </div>
  );
};
export const BondDiscountTooltip = (props: ChartTooltipProps) => {
  const [data] = props.payload || [];
  const price = data?.payload.price || 0;
  const discount = data?.payload.discount || 0;
  const discountedPrice = data?.payload.discountedPrice || 0;
  const date = data?.payload.date || Date.now();

  return (
    <div className="min-w-[150px] rounded-lg border border-transparent bg-light-tooltip p-2 py-1 font-jakarta text-xs font-extralight">
      <TooltipLabel
        value={dynamicFormatter(price.toString())}
        label={`${props.tokenSymbol} Price: `}
        className="mt-2 text-light-primary"
        valueClassName=""
      />
      <TooltipLabel
        value={dynamicFormatter(discountedPrice.toString())}
        label="Bond Price: "
        className="text-light-secondary"
      />
      <TooltipLabel
        value={`${discount.toFixed(2)}%`}
        label={`Discount: `}
        className="text-white"
        valueClassName={`${getDiscountColor(
          price,
          discountedPrice
        )} text-right`}
      />
      <div className="mt-2 text-[10px] text-light-primary-50">
        {format(date, "PP pp")}
      </div>
    </div>
  );
};
