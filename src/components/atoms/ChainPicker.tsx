//@ts-nocheck
import {Select} from "./Select";
import {Input} from "./Input";
import {useEffect, useState} from "react";
import * as bondLibrary from "@bond-protocol/bond-library";

export type ChainPickerProps = {
  className?: string;
  label?: string;
  defaultValue?: { label: string; id: string };
  onChange?: (chain: { label: string; id: string }) => void;
};

const options = bondLibrary.SUPPORTED_CHAINS.map((supportedChain) => ({
  id: supportedChain.chainName,
  label: supportedChain.displayName,
}));

export const ChainPicker = (props: ChainPickerProps) => {
  const [selected, setSelected] = useState(props.defaultValue? props.defaultValue.id : options[0].id);

  useEffect(() => {
    props.onChange && props.onChange(selected);
  }, [selected]);

  const handleChangeSelect = (e: any, value: any) => {
    setSelected(value);
  };

  return (
    <div>
      {props.label && <p className="text-xs font-light mb-1">{props.label}</p>}
      <div className="flex gap-1">
        <div className="w-full">
          <Select
            value={selected}
            defaultValue={props.defaultValue? props.defaultValue.id : options[0].id}
            options={options}
            onChange={handleChangeSelect}
          />
        </div>
      </div>
    </div>
  );
};
