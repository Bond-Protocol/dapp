import { Tooltip, Button } from "..";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "../../assets/icons/minus.svg";
import { useNumericInput } from "hooks/use-numeric-input";

export type PriceControlProps = {
  bottomLabel: string;
  topLabel?: string;
  quoteTokenSymbol?: string;
  payoutTokenSymbol?: string;
  exchangeRate: number;
  onRateChange: (exchangeRate: string | number) => any;
  tooltip?: React.ReactNode;
  percentage?: boolean;
  className?: string;
};

export const PriceControl = (props: PriceControlProps) => {
  const { value, setValue, getAValidPercentage, ...numericInput } =
    useNumericInput(props.exchangeRate.toString(), props.percentage);

  const rateMod = props.percentage ? 0.25 : 0.001;
  const scale = 4;

  const onChange = (e: React.BaseSyntheticEvent) => {
    const updated = numericInput.onChange(e);
    props.onRateChange && props.onRateChange(updated);
  };

  const raiseRate = () => {
    setValue((prev) => {
      let newRate = (parseFloat(prev) + rateMod).toFixed(scale);
      newRate = props.percentage ? getAValidPercentage(newRate) : newRate;

      props.onRateChange && props.onRateChange(newRate);
      return props.percentage ? newRate + "%" : newRate;
    });
  };

  const lowerRate = () => {
    setValue((prev) => {
      let newRate = (parseFloat(prev) - rateMod).toFixed(scale);
      newRate = props.percentage ? getAValidPercentage(newRate) : newRate;
      props.onRateChange && props.onRateChange(newRate);
      return props.percentage ? newRate + "%" : newRate;
    });
  };

  return (
    <div
      className={`flex w-full justify-center bg-white/5 p-4 backdrop-blur-md ${props.className}`}
    >
      <div className="flex items-center justify-center pr-8">
        <Button icon variant="ghost" onClick={lowerRate}>
          <div className="my-[2px] flex h-4 items-center justify-center transition-all duration-300">
            <MinusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
      <div className="text-light-grey-400 flex w-fit flex-col items-center justify-center">
        <div className="flex text-[14px]">
          {props.topLabel ??
            `${props.payoutTokenSymbol} per ${props.quoteTokenSymbol}`}
        </div>

        <div className="font-fraktion text-[25px] text-white">
          <input
            {...numericInput}
            value={value}
            onChange={onChange}
            className="w-min bg-transparent text-center"
          />
        </div>
        <div className="font-fraktion flex font-bold uppercase">
          {props.bottomLabel}
          {props.tooltip && (
            <Tooltip
              content={props.tooltip}
              iconClassname="ml-1 fill-light-grey-500"
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-center pl-8">
        <Button icon variant="ghost" onClick={raiseRate}>
          <div className="my-[2px] flex h-4 items-center justify-center transition-all duration-300">
            <PlusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
    </div>
  );
};
