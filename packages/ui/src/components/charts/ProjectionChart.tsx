import { useEffect, useState } from "react";
import { BondPriceChart, BondPriceChartProps, PlaceholderChart } from "./";
import {
  generateDiscountedPrices,
  getDiscountPercentage,
  PriceData,
  generateFixedDiscountPrice,
  ProjectionConfiguration,
} from "./projection-algorithm";
import { CreateMarketState, useCreateMarket } from "..";

export type ProjectionChartProps = {
  data?: PriceData[];
  initialPrice?: number;
  minPrice?: number;
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
  const [state] = useCreateMarket();

  let maxPremium = 8; // The max premium a bond can get, in %
  let triggerCount = 4; // The amount of bonds purchased -> not yet accurate

  const prices = getProjectionDataset(state, props.data, {
    maxDiscount,
    maxPremium,
    triggerCount,
    fixedPrice: state.priceModels.static.initialPrice, //TODO: Update
  });

  // const edges = findEdges(prices);
  // edges.max = getTopDomain(edges.max);
  // edges.min = getBottomDomain(edges.min);

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
