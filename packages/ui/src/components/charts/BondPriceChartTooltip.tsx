import { formatCurrency, formatDate } from "utils";

const getDiscountColor = (price: number, discount: number) => {
  if (price === discount) return "text-white";
  return price > discount ? "text-light-success" : "text-red-400";
};

type ChartTooltipProps = {
  tokenSymbol: string;
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
      <p className={`text-left text-white ${props.valueClassName}`}>
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
  const date = data?.payload.date || Date.now();
  const minPrice = data?.payload?.minPrice;
  const initialPrice = data?.payload?.initialPrice;

  return (
    <div className="bg-light-tooltip font-jakarta min-w-[150px] rounded-lg border border-transparent p-2 py-1 text-xs font-extralight">
      <TooltipLabel
        value={formatCurrency.dynamicFormatter(price)}
        label={`${props.tokenSymbol} Price: `}
        className="text-light-primary mt-2"
        valueClassName=""
      />
      {discountedPrice && (
        <>
          <TooltipLabel
            value={formatCurrency.dynamicFormatter(discountedPrice)}
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
        </>
      )}
      {initialPrice && (
        <TooltipLabel
          value={formatCurrency.dynamicFormatter(initialPrice)}
          label="Initial Price: "
          className="text-light-secondary"
        />
      )}
      {minPrice && (
        <TooltipLabel
          value={formatCurrency.dynamicFormatter(minPrice)}
          label="Min Price: "
          className="text-red-500"
        />
      )}

      <div className="text-light-primary-50 mt-2 text-[10px]">
        {formatDate.long(date)}
      </div>
    </div>
  );
};
