import { useEffect, useState } from "react";
import {
  BondPriceChart,
  BondPriceChartProps,
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

  let minDiscount = 2;
  let triggerCount = 4;

  const prices = generateDiscountedPrices(
    props.data,
    maxDiscount,
    triggerCount,
    minDiscount
  );

  const edges = findEdges(prices);
  edges.max = getTopDomain(edges.max);
  edges.min = getBottomDomain(edges.min);

  useEffect(() => {
    const initialPrice = props.initialPrice || prices[0].price;
    const discount = getDiscountPercentage(initialPrice, minPrice);
    if (discount < 0) return;
    setMaxDiscount(discount);
  }, [value, minPrice, props.initialPrice]);

  return (
    <div className="w-[35vw]">
      {/* <PriceSlider */}
      {/*   className="w-[35vw]" */}
      {/*   min={edges.min} */}
      {/*   max={edges.max} */}
      {/*   value={value} */}
      {/*   onChange={(e) => { */}
      {/*     e.preventDefault(); */}
      {/*     //@ts-ignore */}
      {/*     setValue(e.target.value); */}
      {/*   }} */}
      {/* /> */}
      <BondPriceChart {...props} data={prices} />
    </div>
  );
};
