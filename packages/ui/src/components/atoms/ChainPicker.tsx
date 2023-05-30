import { Select } from "./Select";
import { useEffect, useState } from "react";
import { Chain, SUPPORTED_CHAINS } from "@bond-protocol/contract-library";

export type ChainPickerProps = {
  className?: string;
  label?: string;
  errorMessage?: string;
  defaultValue?: { label: string; id: string };
  onChange?: (chain: string) => void;
  showTestnets?: boolean;
};

export const ChainPicker = (props: ChainPickerProps) => {
  const options = SUPPORTED_CHAINS.filter((c: Chain) =>
    props.showTestnets ? c.isTestnet : !c.isTestnet
  ).map((supportedChain: Chain) => ({
    id: supportedChain.chainId,
    label: supportedChain.displayName,
    image: supportedChain.image,
  }));

  const [selected, setSelected] = useState(
    props.defaultValue ? props.defaultValue.id : options[0].id
  );

  useEffect(() => {
    props.onChange && props.onChange(selected);
  }, [selected]);

  const handleChangeSelect = (_e: any, value: any) => {
    setSelected(value);
  };

  return (
    <div className="bp__chain_picker">
      {props.label && <p className="text-xs font-light">{props.label}</p>}
      <div className="flex gap-1">
        <div className="w-full">
          <Select
            id="bp__chain_picker_input"
            value={selected}
            defaultValue={
              props.defaultValue ? props.defaultValue.id : options[0].id
            }
            options={options}
            onChange={handleChangeSelect}
          />
        </div>
      </div>
      {props.errorMessage && (
        <div className="my-1 justify-self-start text-xs font-light text-red-500">
          <>{props.errorMessage}</>
        </div>
      )}
    </div>
  );
};
