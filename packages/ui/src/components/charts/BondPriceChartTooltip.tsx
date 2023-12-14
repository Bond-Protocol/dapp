import {
  calculateTrimDigits,
  formatCurrency,
  formatDate,
  trim,
} from "../../utils";

export const getDiscountColor = (price: number, discount: number) => {
  if (price === discount) return "text-white";
  return price > discount ? "text-light-success" : "text-red-400";
};

type ChartTooltipProps = {
  id?: string;
  payoutTokenSymbol: string;
  quoteTokenSymbol?: string;
  useTokenRatio?: boolean;
  payload?: Array<{ payload: any }>;
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
      <p className={`text-left font-mono ${props.valueClassName}`}>
        {props.value}
      </p>
    </div>
  );
};

export const BondPriceChartTooltip = (props: ChartTooltipProps) => {
  const [data] = props.payload || [];
  const price = data?.payload.price || 0;
  const discount = data?.payload.discount || 0;
  const discountedPrice = data?.payload.discountedPrice;
  const date = data?.payload.timestamp || Date.now();

  const getValue = (price: string) => {
    price = props.useTokenRatio
      ? trim(price, calculateTrimDigits(Number(price)))
      : formatCurrency.dynamicFormatter(Number(price));

    price = props.useTokenRatio ? price + props.quoteTokenSymbol || "" : price;

    return price;
  };

  return (
    <div className="bg-light-tooltip font-jakarta min-w-[160px] rounded-lg border border-transparent p-2 py-1 text-xs font-extralight">
      <TooltipLabel
        value={getValue(price)}
        label={`${props.payoutTokenSymbol} Price: `}
        className="text-light-primary mt-2"
        valueClassName="text-white"
      />
      {discountedPrice && (
        <>
          <TooltipLabel
            value={getValue(discountedPrice)}
            label="Bond Price: "
            className="text-light-secondary"
            valueClassName="text-white"
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
        </>
      )}
      <div className="text-light-primary-50 mt-2 text-right text-[10px]">
        {formatDate.long(date)}
      </div>
    </div>
  );
};
