import { useEffect, useState } from "react";
import { BondPriceChart, BondPriceChartProps, PlaceholderChart } from "./";
import {
  generateDiscountedPrices,
  generateFixedDiscountPrice,
  getDiscountPercentage,
  PriceData,
  ProjectionConfiguration,
} from "./projection-algorithm";
import { CreateMarketState, Input, TooltipWrapper, useCreateMarket } from "..";
import { useNumericInput } from "hooks/use-numeric-input";

export type ProjectionChartProps = {
  data?: PriceData[];
  initialPrice?: number;
  initialCapacity?: number;
  minPrice?: number;
  targetDiscount?: number;
  maxBondSize?: number;
  durationInDays?: number;
};

const getProjectionDataset = (
  state: CreateMarketState,
  data: PriceData[],
  args: ProjectionConfiguration
) => {
  return state.priceModel === "dynamic"
    ? generateDiscountedPrices(data, args)
    : generateFixedDiscountPrice(data, args);
};

export const ProjectionChart = ({
  minPrice = 0,
  ...props
}: BondPriceChartProps & ProjectionChartProps) => {
  const [maxDiscount, setMaxDiscount] = useState<number>();
  const {
    value: targetDiscount,
    onChange: setTargetDiscount,
    onBlur,
    onFocus,
  } = useNumericInput("3", true);
  const [state] = useCreateMarket();

  let maxPremium = 8; // The max premium a bond can get, in %
  let triggerCount = 4; // The amount of bonds purchased -> not yet accurate

  const prices = getProjectionDataset(state, props.data, {
    maxDiscount,
    maxPremium,
    triggerCount,
    initialPrice: props.initialPrice,
    initialCapacity: props.initialCapacity,
    minPrice,
    maxBondSize: props.maxBondSize,
    durationInDays: props.durationInDays,
    targetDiscount: parseFloat(targetDiscount),
    fixedPrice: state.priceModels.static.initialPrice, //TODO: Update
  });

  useEffect(() => {
    const initialPrice = props.initialPrice || prices[0]?.price;
    const discount = getDiscountPercentage(initialPrice, minPrice);
    if (discount < 0) return;
    setMaxDiscount(discount);
  }, [minPrice, props.initialPrice]);

  const shouldRender = prices.length > 0;

  return (
    <div className="flex w-full flex-col">
      {shouldRender && (
        <div className="pb-1">
          <TooltipWrapper content="it's basically just to get a rough idea of how things will look, it is based on past token prices and roughly estimated bond prices, it's never going to be accurate enough to worry about the difference between targeting 3.5% and 3.51%, also \&quot;target\&quot; maybe implies more control than actually exists, it's just a tool to see what would have happened assuming people bought at x% discount last week">
            <div className="flex items-center justify-end">
              <p className="text-light-secondary mr-2 font-mono text-sm uppercase">
                Discount
              </p>
              <Input
                id="cm-target-discount-input"
                className="h-[60%] w-[11%] self-end"
                inputClassName="text-center mr-1.5 mb-0.5"
                rootClassName="text-center justify-end h-[28px]"
                value={targetDiscount}
                onChange={setTargetDiscount}
                onBlur={onBlur}
                onFocus={onFocus}
              />
            </div>
          </TooltipWrapper>
        </div>
      )}
      <div className="h-full w-full">
        {!shouldRender ? (
          <div className="h-[99%] w-full">
            <PlaceholderChart message="Market simulation will appear here" />
          </div>
        ) : (
          <div className="h-[99%] w-full">
            <BondPriceChart {...props} data={prices} />
          </div>
        )}
      </div>
    </div>
  );
};
