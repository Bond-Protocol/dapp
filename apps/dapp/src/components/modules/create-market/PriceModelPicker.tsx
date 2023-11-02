import { useEffect, useState } from "react";
import { FlatSelect, Switch, TooltipWrapper } from "ui";
import { ReactComponent as SawLineIcon } from "assets/icons/saw-line.svg";
import { ReactComponent as LineIcon } from "assets/icons/line.svg";
import { ReactComponent as AngleIcon } from "assets/icons/angle.svg";
import { PriceModelDetails } from "./PriceModelDetails";
import { PriceModel, PriceType } from "./create-market-reducer";
import { PriceControl, PriceControlProps } from "./PriceControl";

export type PriceModelPickerProps = {
  onChange: (args: {
    priceModel: PriceModel;
    oracle: boolean;
    oracleAddress: string;
  }) => any;
  id?: string;
  chain: string;
  oraclePrice?: number;
  oracleMessage?: string;
  isOracleValid?: boolean;
} & Partial<PriceControlProps>;

const options = [
  {
    label: "DYNAMIC",
    Icon: SawLineIcon,
    value: "dynamic",
  },
  {
    label: "STATIC",
    Icon: LineIcon,
    value: "static",
  },
];

const priceControlConfig: Record<
  PriceModel,
  Array<Partial<PriceControlProps> & { property: string }>
> = {
  dynamic: [
    {
      property: "initialPrice",
      topLabel: "Initial Price",
      display: "exchange_rate",
      returnValue: "exchange_rate",
    },
    {
      property: "minPrice",
      topLabel: "Min Price",
      display: "exchange_rate",
      returnValue: "exchange_rate",
    },
  ],
  static: [
    {
      property: "fixedPrice",
      topLabel: "Fixed Price",
      display: "exchange_rate",
      returnValue: "exchange_rate",
    },
  ],
  ["oracle-dynamic"]: [
    {
      property: "baseDiscount",
      topLabel: "Base Discount",
      display: "percentage",
      returnValue: "percentage",
      initialValue: "5",
    },
    {
      property: "targetIntervalDiscount",
      topLabel: "Target Interval Discount",
      display: "percentage",
      returnValue: "percentage",
      initialValue: "10",
    },
    {
      property: "maxDiscountFromCurrent",
      topLabel: "Max Discount From Start",
      display: "percentage",
      returnValue: "percentage",
      initialValue: "20",
    },
  ],
  ["oracle-static"]: [
    {
      property: "fixedDiscount",
      topLabel: "Fixed Discount",
      display: "percentage",
      returnValue: "percentage",
    },
    {
      property: "maxDiscountFromCurrent",
      topLabel: "Max Discount From Start",
      display: "percentage",
      returnValue: "percentage",
      initialValue: "20",
    },
  ],
};

export const PriceModelPicker = (props: PriceModelPickerProps) => {
  const [type, setType] = useState<PriceType>("dynamic");
  const [oracle, setOracle] = useState(false);
  const [oracleAddress, setOracleAddress] = useState("");

  const priceModel: PriceModel = oracle ? `oracle-${type}` : type;

  const priceControlFields = priceControlConfig[priceModel];

  useEffect(() => {
    props.onChange({ priceModel, oracle, oracleAddress });
  }, [type, oracle, oracleAddress]);

  const shouldRender = props.quoteToken?.symbol && props.payoutToken?.symbol;

  return (
    <div id={props.id} className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-light-grey-400">Price Model</p>
        {Number(props.chain) !== 1 ? (
          <Switch
            label="Oracle"
            onChange={(e) => {
              setOracle(e.target.checked);
              if (!e.target.checked) setOracleAddress("");
            }}
          />
        ) : (
          <div>
            <TooltipWrapper content="Oracle markets are currently unavailable on Ethereum Mainnet">
              <Switch disabled label="Oracle" onChange={(e) => {}} />
            </TooltipWrapper>
          </div>
        )}
      </div>

      <FlatSelect
        className="mt-2"
        options={options}
        onChange={(e: PriceType) => setType(e)}
      />

      <PriceModelDetails
        className="mt-4"
        oracle={oracle}
        type={type}
        onOracleChange={setOracleAddress}
        oracleMessage={props.oracleMessage || ""}
        isOracleValid={props.isOracleValid}
      />
      <div className="flex justify-between gap-x-4 pt-4">
        {!shouldRender ? (
          <div
            className={`flex max-h-[104px] w-full justify-center bg-white/5 p-4 backdrop-blur-md`}
          >
            <div className="flex items-center justify-center py-4 text-sm text-light-grey">
              <AngleIcon className="h-12 w-12 fill-light-grey pr-2 text-light-grey" />
              Select tokens to <br /> view price controls{" "}
            </div>
          </div>
        ) : (
          priceControlFields.map((p: any) => {
            return (
              <PriceControl
                {...p}
                key={`${priceModel}-${p.property}`}
                payoutToken={props.payoutToken}
                quoteToken={props.quoteToken}
                oraclePrice={props.oraclePrice}
                onRateChange={(rate: any, reversed: boolean) => {
                  props.onRateChange &&
                    props.onRateChange({
                      priceModel,
                      [p.property]: rate,
                      reversed,
                    });
                  return { priceModel, [p.property]: rate, reversed };
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
