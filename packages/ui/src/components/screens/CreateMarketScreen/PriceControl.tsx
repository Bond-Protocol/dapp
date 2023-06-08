import { useEffect, useState } from "react";
import { Tooltip, Button, TooltipWrapper, TooltipIcon } from "components";
import { calculateTrimDigits, getPriceScale, getRateMod, trim } from "utils";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { useNumericInput } from "hooks/use-numeric-input";
import { Token } from "./create-market-reducer";

export type PriceControlProps = {
  bottomLabel: string;
  topLabel?: string;
  quoteToken?: Token;
  payoutToken?: Token;
  oraclePrice?: number;
  exchangeRate: number;
  onRateChange: (exchangeRate: any) => any;
  tooltip?: React.ReactNode;
  display: "percentage" | "exchange_rate";
  returnValue: "percentage" | "exchange_rate";
  initialValue?: string;
  className?: string;
};

export const PriceControl = (props: PriceControlProps) => {
  const { value, setValue, getAValidPercentage, ...numericInput } =
    useNumericInput(props.initialValue, props.display === "percentage");

  const [rate, setRate] = useState<number>();
  const [payoutPerQuote, setPayoutPerQuote] = useState<number>();
  const [exchangeLabel, setExchangeLabel] = useState<string>();

  const [rateMod, setRateMod] = useState(0.25); // Default rate mod for percentages;
  const [scale, setScale] = useState(2); // Default scale for percentages;

  useEffect(() => {
    if (!rate) return;
    const displayRate = trim(rate, calculateTrimDigits(rate));
    const exchangeLabel =
      displayRate +
      " " +
      props.quoteToken?.symbol +
      " per " +
      props.payoutToken?.symbol;
    setExchangeLabel(exchangeLabel);

    if (props.returnValue === "exchange_rate") {
      props.onRateChange && props.onRateChange(rate);
    } else {
      props.onRateChange && props.onRateChange(value.replace("%", ""));
    }
  }, [rate]);

  useEffect(() => {
    if (!(props.quoteToken?.price && props.payoutToken?.price)) return;

    let rate = props.oraclePrice
      ? Number(props.oraclePrice)
      : props.payoutToken?.price / props.quoteToken?.price;

    if (props.display !== "percentage") {
      const rateMod = getRateMod(rate);
      const scale = getPriceScale(rate);
      setRate(rate);
      setPayoutPerQuote(1 / rate);

      setValue(rate.toFixed(scale));
      setRateMod(rateMod);
      setScale(scale);
    } else {
      const underlyingRate = (rate / 100) * (100 - rateMod);
      setRate(underlyingRate);
      setPayoutPerQuote(1 / underlyingRate);
    }
  }, [props.payoutToken, props.quoteToken, props.oraclePrice]);

  const onChange = (e: React.BaseSyntheticEvent) => {
    if (e.toString().charAt(e.toString().length - 1) === ".") return;

    const updated = numericInput.onChange(e);
    if (
      props.quoteToken &&
      props.payoutToken &&
      props.display === "percentage"
    ) {
      const initialRate = props.oraclePrice
        ? props.oraclePrice
        : props.payoutToken?.price / props.quoteToken?.price;

      const underlyingRate = (initialRate / 100) * (100 - updated);
      setRate(underlyingRate);
      setPayoutPerQuote(1 / underlyingRate);

      if (props.returnValue === "exchange_rate") {
        props.onRateChange && props.onRateChange(underlyingRate);
      } else {
        props.onRateChange && props.onRateChange(value.replace("%", ""));
      }
    } else {
      setRate(Number(updated));
      setPayoutPerQuote(1 / Number(updated));
      props.onRateChange && props.onRateChange(updated);
    }
  };

  const raiseRate = () => {
    setValue((incoming) => {
      if (!(props.quoteToken && props.payoutToken)) return "";

      let prev = incoming === "" ? "0" : incoming;
      let newRate = (parseFloat(prev) + rateMod).toFixed(scale);

      if (props.display === "percentage") {
        const initialRate = props.oraclePrice
          ? props.oraclePrice
          : props.payoutToken?.price / props.quoteToken?.price;

        const underlyingRate = (initialRate / 100) * (100 - Number(newRate));
        setRate(underlyingRate);
        setPayoutPerQuote(1 / underlyingRate);

        newRate = Number(getAValidPercentage(newRate)).toFixed(scale);
        return newRate + "%";
      }

      setRate(Number(newRate));
      setPayoutPerQuote(1 / Number(newRate));
      return newRate;
    });
  };

  const lowerRate = () => {
    setValue((incoming) => {
      if (!(props.quoteToken && props.payoutToken)) return "";

      let prev = incoming === "" ? "0" : incoming;
      let newRate = (parseFloat(prev) - rateMod).toFixed(scale);

      if (Number(newRate) < 0) {
        newRate = "0.00";
      }

      if (props.display === "percentage") {
        const initialRate = props.oraclePrice
          ? props.oraclePrice
          : props.payoutToken?.price / props.quoteToken?.price;

        const underlyingRate = (initialRate / 100) * (100 - Number(newRate));
        setRate(underlyingRate);
        setPayoutPerQuote(1 / underlyingRate);

        newRate = Number(getAValidPercentage(newRate)).toFixed(scale);
        return newRate + "%";
      }

      setRate(Number(newRate));
      setPayoutPerQuote(1 / Number(newRate));
      return newRate;
    });
  };

  const smallText = value.length >= 12;

  return (
    <div
      className={`text-light-grey-400 max-h-[104px] bg-white/5 px-4 py-3 backdrop-blur-md ${props.className}`}
    >
      <TooltipWrapper content={props.tooltip}>
        <div className="font-fraktion flex justify-center font-bold uppercase">
          {props.topLabel}
          {props.tooltip && (
            <TooltipIcon className="fill-light-grey-400 ml-1" />
          )}
        </div>
      </TooltipWrapper>

      <div
        className={`flex max-h-[104px] w-full justify-center ${props.className}`}
      >
        <div className="flex items-center justify-center">
          <Button icon variant="ghost" onClick={lowerRate}>
            <div className="my-[2px] flex h-4 items-center justify-center transition-all duration-300">
              <MinusIcon className="group-hover/button:fill-light-secondary fill-white" />
            </div>
          </Button>
        </div>
        <div className="text-light-grey-400 flex w-fit flex-col items-center justify-center">
          <div
            className={`font-fraktion text-white ${
              smallText ? "text-xs" : "text-[20px]"
            }`}
          >
            <input
              {...numericInput}
              value={value}
              onChange={onChange}
              className="w-[170px] bg-transparent text-center"
            />
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
      <div
        className={`text-light-grey-400 flex select-none justify-center text-[14px] ${
          props.display === "percentage" ? "" : "cursor-pointer"
        } ${smallText ? "text-xs" : "text-sm"}`}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {exchangeLabel}
      </div>
    </div>
  );
};
