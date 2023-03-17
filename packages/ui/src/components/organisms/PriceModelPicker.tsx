import { useState, useEffect } from "react";
import { FlatSelect, InfoLabel, Switch } from "..";
import { ReactComponent as SawLineIcon } from "../../assets/icons/saw-line.svg";
import { ReactComponent as LineIcon } from "../../assets/icons/line.svg";
import {
  PriceModelDetails,
  PriceType,
} from "components/molecules/PriceModelDetails";
import { PriceControl } from "components/molecules/PriceControl";

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

export const PriceModelPicker = (props: PriceModelPrickerProps) => {
  const [type, setType] = useState<PriceType>("dynamic");
  const [oracle, setOracle] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    props.onModelChange({ type, oracle, address });
  }, [type, oracle, address]);

  return (
    <div className="max-w-[560px]">
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
      <div className="flex gap-x-4 pt-4"></div>
    </div>
  );
};
