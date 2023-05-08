//@ts-nocheck
import { useState, useEffect } from "react";
import { FlatSelect } from "components";
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
      topLabel: "Initial Discount",
      display: "percentage",
    },
    {
      property: "minPrice",
      topLabel: "Min Price",
      display: "exchange_rate",
    },
  ],
  static: [
    {
      property: "initialPrice",
      topLabel: "Fixed Price",
      display: "percentage",
    }
  ],
  ["oracle-dynamic"]: [
    {
      property: "initialDiscount",
      bottomLabel: "From Oracle Price",
      topLabel: "Initial Discount",
      display: "percentage",
    },
    {
      property: "minPrice",
      topLabel: "Min Price",
      display: "exchange_rate",
    },
  ],
  ["oracle-static"]: [
    {
      property: "initialDiscount",
      bottomLabel: "From Oracle Price",
      topLabel: "Fixed Discount",
      display: "percentage",
    },
    {
      property: "minPrice",
      topLabel: "Min Price",
      display: "exchange_rate",
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
      {/* <div className="flex items-center justify-between"> */}
      {/*   <p className="text-light-grey-400 text-sm">Price Model</p> */}
      {/*   <Switch label="Oracle" onChange={(e) => setOracle(e.target.checked)} /> */}
      {/* </div> */}

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
      />
      <div className="flex justify-between gap-x-4 pt-4">
        {!shouldRender ? (
          <div
            className={`flex max-h-[104px] w-full justify-center bg-white/5 p-4 backdrop-blur-md`}
          >
            <div className="text-light-grey flex items-center justify-center py-4 text-sm">
              <AngleIcon className="fill-light-grey text-light-grey h-12 w-12 pr-2" />
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
                onRateChange={(rate, reversed) => {
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
