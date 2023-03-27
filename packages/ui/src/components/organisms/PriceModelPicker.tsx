//@ts-nocheck
import { useState, useEffect } from "react";
import { FlatSelect, Switch } from "..";
import { ReactComponent as SawLineIcon } from "../../assets/icons/saw-line.svg";
import { ReactComponent as LineIcon } from "../../assets/icons/line.svg";
import {
  PriceModelDetails,
  PriceModel,
  PriceType,
} from "components/molecules/PriceModelDetails";
import {
  PriceControl,
  PriceControlProps,
} from "components/molecules/PriceControl";
import { ReactComponent as AngleIcon } from "../../assets/icons/angle.svg";

export type PriceModelPickerProps = {
  onChange: (args: {
    priceModel: PriceModel;
    oracle: boolean;
    oracleAddress: string;
  }) => any;
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
    { property: "initialPrice", bottomLabel: "Initial Price" },
    { property: "minPrice", bottomLabel: "Min Price" },
  ],
  static: [{ property: "initialPrice", bottomLabel: "Fixed Price" }],
  ["oracle-dynamic"]: [
    {
      property: "initialDiscount",
      topLabel: "From Oracle Price",
      bottomLabel: "Initial Discount",
      percentage: true,
    },
    { property: "minPrice", bottomLabel: "Min Price" },
  ],
  ["oracle-static"]: [
    {
      property: "initialDiscount",
      topLabel: "From Oracle Price",
      bottomLabel: "Fixed Discount",
      percentage: true,
    },
    { property: "minPrice", bottomLabel: "Min Price" },
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
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-light-grey-400 text-sm">Price Model</p>
        <Switch label="Oracle" onChange={(e) => setOracle(e.target.checked)} />
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
          priceControlFields.map((p: any, i) => {
            return (
              <PriceControl
                {...p}
                key={`${priceModel}-${p.property}`}
                payoutToken={props.payoutToken}
                quoteToken={props.quoteToken}
                onRateChange={(rate) => {
                  props.onRateChange &&
                    props.onRateChange({ priceModel, [p.property]: rate });
                  return { priceModel, [p.property]: rate };
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
