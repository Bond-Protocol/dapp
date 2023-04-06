import { useEffect, useState } from "react";
import { BondPriceChart, BondPriceChartProps, PlaceholderChart } from "./";
import {
  getDiscountPercentage,
  PriceData,
  generateFixedDiscountPrice,
  ProjectionConfiguration,
  generatedDiscountedPricesSimple,
} from "./projection-algorithm";
import { CreateMarketState, useCreateMarket } from "..";

export type ProjectionChartSimpleProps = {
  data?: PriceData[];
  initialPrice?: number;
  minPrice?: number;
  isReversed?: boolean;
};

const getProjectionDataset = (
  state: CreateMarketState,
  data: PriceData[],
  args: ProjectionConfiguration
) => {
  return state.priceModel === "dynamic"
    ? generatedDiscountedPricesSimple(data, args)
    : generateFixedDiscountPrice(data, args);
};

export const ProjectionChartSimple = ({
  minPrice = 0,
  ...props
}: BondPriceChartProps & ProjectionChartSimpleProps) => {
  const [maxDiscount, setMaxDiscount] = useState(3);
  const [state] = useCreateMarket();

  let maxPremium = 8; // The max premium a bond can get, in %
  let triggerCount = 4; // The amount of bonds purchased -> not yet accurate

  const fixedPrice = state.priceModels.static.initialPrice;
  const initialPrice = state.priceModels.dynamic.initialPrice;
  const minimumPrice = state.priceModels.dynamic.minPrice;

  const prices = getProjectionDataset(state, props.data, {
    maxDiscount,
    maxPremium,
    triggerCount,
    fixedPrice: props.isReversed ? 1 / fixedPrice : fixedPrice,
    initialPrice: props.isReversed ? 1 / initialPrice : initialPrice,
    minPrice: props.isReversed ? 1 / minimumPrice : minimumPrice,
  });

  useEffect(() => {
    const initialPrice = props.initialPrice || prices[0]?.price;
    const discount = getDiscountPercentage(initialPrice, minPrice);
    if (discount < 0) return;
    setMaxDiscount(discount);
  }, [minPrice, props.initialPrice]);

  const shouldRender = prices.length > 0;

  return (
    <div className="h-full w-[35vw]">
      {!shouldRender ? (
        <div className="h-[99%] w-full">
          <PlaceholderChart message="Market simulation will appear here" />
        </div>
      ) : (
        <BondPriceChart {...props} data={prices} />
      )}
    </div>
  );
};
