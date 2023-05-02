//@ts-nocheck
import {useEffect, useState} from "react";
import {BondPriceChart, BondPriceChartProps, PlaceholderChart} from "./";
import {
  generateDiscountedPrices,
  generateFixedDiscountPrice,
  getDiscountPercentage,
  PriceData,
  ProjectionConfiguration,
} from "./projection-algorithm";
import {CreateMarketState, Input, useCreateMarket} from "..";

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
  const [maxDiscount, setMaxDiscount] = useState(3);
  const [targetDiscount, setTargetDiscount] = useState(3);
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
    targetDiscount: targetDiscount,
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
    <>

      <Input
        id="cm-target-discount-input"
        className="mb-[-48px] 2 max-w-[48px]"
        value={targetDiscount}
        onChange={(e) => setTargetDiscount(e.target.value)}
      />
    <div className="h-full w-[35vw]">
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
    </>

  );
};
