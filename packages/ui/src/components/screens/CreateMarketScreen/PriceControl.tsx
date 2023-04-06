import { useEffect, useState } from "react";
import { Tooltip, Button } from "components";
import { getPriceScale } from "utils";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { useNumericInput } from "hooks/use-numeric-input";
import { Token } from "./create-market-reducer";

export type PriceControlProps = {
  bottomLabel: string;
  topLabel?: string;
  quoteToken?: Token;
  payoutToken?: Token;
  exchangeRate: number;
  onRateChange: (exchangeRate: any, isReversed?: boolean) => any;
  tooltip?: React.ReactNode;
  percentage?: boolean;
  className?: string;
};

export const PriceControl = (props: PriceControlProps) => {
  const { value, setValue, getAValidPercentage, ...numericInput } =
    useNumericInput("0.25", props.percentage);
  const [rateMod, setRateMod] = useState(0.25); // Default rate mod for percetages;
  const [scale, setScale] = useState(2); // Default scale for percentages;

  const [isReversed, setIsReversed] = useState(true);

  useEffect(() => {
    if (props.quoteToken && props.payoutToken && !props.percentage) {
      const initialRate = props.quoteToken?.price / props.payoutToken.price;

      const reverseRate = 1 / initialRate;
      const rate = isReversed ? reverseRate : initialRate;

      const { rateMod, scale } = getPriceScale(rate);

      setValue(rate.toFixed(scale));

      setRateMod(rateMod);
      setScale(scale);

      props.onRateChange(initialRate, isReversed);
    }
  }, [isReversed, props.quoteToken, props.payoutToken]);

  const handleRateChange = (amount: number) => {
    const rate = isReversed ? 1 / amount : amount;
    const reversedRate = isReversed ? amount : 1 / amount;
    return { rate, reversedRate };
  };

  const onChange = (e: React.BaseSyntheticEvent) => {
    const updated = numericInput.onChange(e);
    const rates = handleRateChange(updated);

    props.onRateChange && props.onRateChange(rates.rate, isReversed);
  };

  const raiseRate = () => {
    setValue((prev) => {
      let newRate = parseFloat(prev) + rateMod;

      let rate = isReversed ? 1 / newRate : newRate;
      let reverseRate = isReversed ? newRate : 1 / newRate;

      props.onRateChange && props.onRateChange(rate, isReversed);

      return (isReversed ? reverseRate : rate).toFixed(scale);
    });
  };

  const lowerRate = () => {
    setValue((prev) => {
      let newRate = parseFloat(prev) - rateMod;
      let rate = isReversed ? 1 / newRate : newRate;
      let reverseRate = isReversed ? newRate : 1 / newRate;
      props.onRateChange && props.onRateChange(rate, isReversed);
      return (isReversed ? reverseRate : rate).toFixed(scale);
    });
  };

  const exchangeLabel =
    props.quoteToken?.symbol && props.payoutToken?.symbol
      ? `${props.payoutToken?.symbol || "???"} per ${
          props.quoteToken?.symbol || "???"
        }`
      : "";

  return (
    <div
      className={`flex max-h-[104px] w-full justify-center bg-white/5 p-4 backdrop-blur-md ${props.className}`}
    >
      <div className="flex items-center justify-center">
        <Button icon variant="ghost" onClick={lowerRate}>
          <div className="my-[2px] flex h-4 items-center justify-center transition-all duration-300">
            <MinusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
      <div className="text-light-grey-400 flex w-fit flex-col items-center justify-center">
        <div className="font-fraktion flex font-bold uppercase">
          {props.bottomLabel}
          {props.tooltip && (
            <Tooltip
              content={props.tooltip}
              iconClassname="ml-1 fill-light-grey-500"
            />
          )}
        </div>

        <div className="font-fraktion text-[25px] text-white">
          <input
            {...numericInput}
            value={value}
            onChange={onChange}
            className="w-[170px] bg-transparent text-center"
          />
        </div>
        <div
          className={`flex select-none text-[14px] ${
            props.percentage ? "" : "cursor-pointer"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsReversed((prev) => !prev);
          }}
        >
          {props.topLabel ??
            (isReversed
              ? exchangeLabel.split(" ").reverse().join(" ")
              : exchangeLabel)}
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <Button icon variant="ghost" onClick={raiseRate}>
          <div className="my-[2px] flex h-4 items-center justify-center transition-all duration-300">
            <PlusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
    </div>
  );
};
