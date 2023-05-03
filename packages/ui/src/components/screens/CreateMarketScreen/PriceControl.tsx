import { useEffect, useState } from "react";
import { Tooltip, Button } from "components";
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
  exchangeRate: number;
  onRateChange: (exchangeRate: any) => any;
  tooltip?: React.ReactNode;
  display: "percentage" | "exchange_rate";
  exchangeRateOrder: "payout_per_quote" | "quote_per_payout",
  className?: string;
};

export const PriceControl = (props: PriceControlProps) => {
  const { value, setValue, getAValidPercentage, ...numericInput } =
    useNumericInput("0.25", props.display === "percentage");

  const [rate, setRate] = useState();
  const [payoutPerQuote, setPayoutPerQuote] = useState();
  const [exchangeLabel, setExchangeLabel] = useState();

  const [rateMod, setRateMod] = useState(0.25); // Default rate mod for percentages;
  const [scale, setScale] = useState(2); // Default scale for percentages;

  useEffect(() => {
    if (!rate) return;
    const displayRate = trim(rate, calculateTrimDigits(rate));
    const exchangeLabel = displayRate + " " + props.quoteToken?.symbol + " per " + props.payoutToken?.symbol;
    setExchangeLabel(exchangeLabel);
    props.onRateChange && props.onRateChange(rate);
  }, [rate]);

  useEffect(() => {
    if (!(props.quoteToken && props.payoutToken)) return;

    const rate = props.payoutToken?.price / props.quoteToken.price;

    if (!(props.display === "percentage")) {
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
  }, [props.payoutToken, props.quoteToken]);

  const onChange = (e: React.BaseSyntheticEvent) => {
    const updated = numericInput.onChange(e);
    if (props.quoteToken && props.payoutToken && (props.display === "percentage")) {
      const initialRate = props.payoutToken?.price / props.quoteToken.price;
      const underlyingRate = (initialRate / 100) * (100 - updated);
      setRate(underlyingRate);
      setPayoutPerQuote(1 / underlyingRate);
      props.onRateChange && props.onRateChange(underlyingRate);
    } else {
      props.onRateChange && props.onRateChange(updated);
    }
  };

  const raiseRate = () => {
    setValue((incoming) => {
      if (!(props.quoteToken && props.payoutToken)) return "";

      let prev = incoming === "" ? "0" : incoming;
      let newRate = (parseFloat(prev) + rateMod).toFixed(scale);

      if (props.display === "percentage") {
        const initialRate = props.payoutToken?.price / props.quoteToken.price;
        const underlyingRate = (initialRate / 100) * (100 - newRate);
        setRate(underlyingRate);
        setPayoutPerQuote(1 / underlyingRate);

        newRate = Number(getAValidPercentage(newRate)).toFixed(scale);
        return newRate + "%";
      }

      setRate(newRate);
      setPayoutPerQuote(1 / newRate);
      return newRate;
    });
  };

  const lowerRate = () => {
    setValue((incoming) => {
      if (!(props.quoteToken && props.payoutToken)) return "";

      let prev = incoming === "" ? "0" : incoming;
      let newRate = (parseFloat(prev) - rateMod).toFixed(scale);

      if (Number(newRate) < 0) {
        newRate = "0";
      }

      if (props.display === "percentage") {
        const initialRate = props.payoutToken?.price / props.quoteToken.price;
        const underlyingRate = (initialRate / 100) * (100 - newRate);
        setRate(underlyingRate);
        setPayoutPerQuote(1 / underlyingRate);

        newRate = Number(getAValidPercentage(newRate)).toFixed(scale);
        return newRate + "%";
      }

      setRate(newRate);
      setPayoutPerQuote(1 / newRate);
      return newRate;
    });
  };

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
          {props.topLabel}
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
            props.display === "percentage" ? "" : "cursor-pointer"
          }`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {exchangeLabel}
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
