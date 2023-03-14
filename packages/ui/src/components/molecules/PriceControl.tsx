import { Button } from "..";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "../../assets/icons/minus.svg";
import { useState } from "react";

export type PriceControlProps = {
  topLabel: string;
  quoteTokenSymbol: string;
  payoutTokenSymbol: string;
  exchangeRate: number;
  onRateChange: (exchangeRate: number) => any;
};

export const PriceControl = (props: PriceControlProps) => {
  const [rate, setRate] = useState(props.exchangeRate);

  const raiseRate = () => {
    setRate((rate) => {
      const newRate = Number((rate + 0.01).toFixed(4));
      props.onRateChange && props.onRateChange(newRate);
      return newRate;
    });
  };

  const lowerRate = () => {
    setRate((rate) => {
      const newRate = Number((rate - 0.01).toFixed(4));
      props.onRateChange && props.onRateChange(newRate);
      return newRate;
    });
  };

  return (
    <div className="flex justify-center p-4 backdrop-blur-md">
      <div className="flex items-center justify-center pr-8">
        <Button icon variant="ghost" onClick={lowerRate}>
          <div className="my-[2px] flex h-4 w-4 items-center justify-center transition-all duration-300">
            <MinusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
      <div className="text-light-grey-400 flex flex-col items-center justify-center">
        <div className="font-fraktion font-bold uppercase">
          {props.topLabel}
        </div>
        <div className="font-fraktion text-[25px] text-white">{rate}</div>
        <div className="text-[14px]">{`${props.payoutTokenSymbol} per ${props.quoteTokenSymbol}`}</div>
      </div>
      <div className="flex items-center justify-center pl-8">
        <Button icon variant="ghost" onClick={raiseRate}>
          <div className="my-[2px] flex h-4 w-4 items-center justify-center transition-all duration-300">
            <PlusIcon className="group-hover/button:fill-light-secondary fill-white" />
          </div>
        </Button>
      </div>
    </div>
  );
};
