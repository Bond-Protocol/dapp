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

export type PriceModelPrickerProps = {
  a?: any;
  onModelChange: (args: {
    type: PriceType;
    oracle: boolean;
    address: string;
  }) => any;
};

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

export const PriceModelPicker = (props: PriceModelPrickerProps) => {
  const [type, setType] = useState<PriceType>("dynamic");
  const [oracle, setOracle] = useState(false);
  const [address, setAddress] = useState("");

  const priceModel: PriceModel = oracle ? `oracle-${type}` : type;

  const priceControlFields = priceControlConfig[priceModel];

  useEffect(() => {
    props.onModelChange({ type, oracle, address });
  }, [type, oracle, address]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <p className="text-light-grey-400 text-sm">Price Model</p>
        <Switch label="Oracle" onChange={(e) => setOracle(e.target.checked)} />
      </div>

      <FlatSelect
        className="mt-2"
        options={options}
        onChange={(e: PriceType) => {
          setType(e);
        }}
      />

      <PriceModelDetails
        className="mt-4"
        oracle={oracle}
        type={type}
        onOracleChange={setAddress}
      />
      <div className="flex justify-between gap-x-4 pt-4">
        {priceControlFields.map((p: any) => {
          return (
            <PriceControl
              {...p}
              exchangeRate={0.25}
              onRateChange={(rate) => {
                return { priceModel, [p.property]: rate };
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
