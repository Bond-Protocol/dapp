import { useEffect, useState } from "react";
import {
  BondPriceChart,
  BondPriceChartProps,
  PlaceholderChart,
  getBottomDomain,
  getTopDomain,
  //PriceSlider,
} from "./";
import {
  findEdges,
  generateDiscountedPrices,
  getDiscountPercentage,
  PriceData,
} from "./projection-algorithm";
import { ReactComponent as ChartIcon } from "assets/icons/chart-large.svg";

export type ProjectionChartProps = {
  data?: PriceData[];
  initialPrice?: number;
  minPrice?: number;
};

export const ProjectionChart = ({
  minPrice = 0,
  ...props
}: BondPriceChartProps & ProjectionChartProps) => {
  const [value, setValue] = useState(27500);
  const [maxDiscount, setMaxDiscount] = useState(3);

  let maxPremium = 8; // The max premium a bond can get, in %
  let triggerCount = 4; // The amount of bonds purchased -> not yet accurate

  const prices = generateDiscountedPrices(
    props.data,
    maxDiscount,
    triggerCount,
    maxPremium
  );

  const edges = findEdges(prices);
  edges.max = getTopDomain(edges.max);
  edges.min = getBottomDomain(edges.min);

  useEffect(() => {
    const initialPrice = props.initialPrice || prices[0]?.price;
    const discount = getDiscountPercentage(initialPrice, minPrice);
    if (discount < 0) return;
    setMaxDiscount(discount);
  }, [value, minPrice, props.initialPrice]);

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
