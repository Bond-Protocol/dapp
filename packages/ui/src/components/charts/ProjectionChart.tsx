import { BondPriceChart, BondPriceChartProps, PlaceholderChart } from "./";
import {
  generateSDAChartData,
  generateFPAChartData,
  generateOSDAChartData,
  generateOFDAChartData,
  PriceData,
  ProjectionConfiguration,
} from "./projection-algorithm";
import {
  CreateMarketState,
  Input,
  Switch,
  TooltipWrapper,
  useCreateMarket,
} from "..";
import { useNumericInput } from "hooks/use-numeric-input";
import { useState } from "react";

export type ProjectionChartProps = {
  data?: PriceData[];
  payoutTokenSymbol: string;
  quoteTokenSymbol: string;
  initialCapacity?: number;
  initialPrice?: number;
  minPrice?: number;
  targetDiscount?: number;
  durationInDays?: number;
  depositInterval?: number;
  fixedDiscount?: number;
  baseDiscount?: number;
  targetIntervalDiscount?: number;
  fixedPrice?: number;
  maxDiscountFromCurrent?: number;
};

const getProjectionDataset = (
  state: CreateMarketState,
  data: PriceData[],
  args: ProjectionConfiguration
) => {
  switch (state.priceModel) {
    case "dynamic":
      return generateSDAChartData(data, args);
    case "static":
      return generateFPAChartData(data, args);
    case "oracle-dynamic":
      return generateOSDAChartData(data, args);
    case "oracle-static":
      return generateOFDAChartData(data, args);
  }
};

export const ProjectionChart = (
  props: BondPriceChartProps & ProjectionChartProps
) => {
  const [state] = useCreateMarket();

  const {
    value: targetDiscount,
    onChange: setTargetDiscount,
    onBlur,
    onFocus,
  } = useNumericInput("5", true);

  const [useTokenPrices, setUseTokenPrices] = useState(false);

  console.log({ props, state });
  const prices = getProjectionDataset(state, props.data, {
    tokenPrices: useTokenPrices,
    targetDiscount: parseFloat(targetDiscount),
    initialCapacity: Number(state.capacity) ?? 0,
    initialPrice: Number(state.priceModels[state.priceModel]?.initialPrice),
    minPrice: Number(state.priceModels[state.priceModel]?.minPrice),
    durationInDays: state.durationInDays,
    depositInterval: state.depositInterval,
    fixedDiscount: props.fixedDiscount,
    baseDiscount: props.baseDiscount,
    targetIntervalDiscount: props.targetIntervalDiscount,
    fixedPrice: props.fixedPrice,
    maxDiscountFromCurrent: props.maxDiscountFromCurrent,
  });

  const shouldRender = prices.length > 0;

  console.log("ProjectionChart", { prices });

  return (
    <div className="flex w-full flex-col">
      {shouldRender && (
        <div className="pb-1">
          <TooltipWrapper content="The market simulation provides a rough estimate of how bond prices and sales are likely to occur, applying the current price settings to historical token prices. It is not intended to be extremely accurate, just to give an idea of how different settings could affect bond sales. The 'DISCOUNT' box above, allows you to compare market performance with different assumptions of the discount at which users will be interested in purchasing bonds.">
            <div className="flex items-center justify-end">
              {state.priceModel === "dynamic" && (
                <>
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
                </>
              )}
              <div className="mr-2">
                <Switch
                  label="Token Ratio"
                  onChange={(e) => {
                    setUseTokenPrices(e.target.checked);
                  }}
                />
              </div>
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
            <BondPriceChart
              {...props}
              data={prices}
              useTokenRatio={useTokenPrices}
            />
          </div>
        )}
      </div>
    </div>
  );
};
