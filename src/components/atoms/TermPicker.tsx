//@ts-nocheck
import {Select} from "./Select";
import {Input} from "./Input";
import {useEffect, useState} from "react";

export type TermPickerProps = {
  className?: string;
  label?: string;
  defaultValue?: { amount: number; id: number };
  onChange?: (time: { amount: number; id: number }) => void;
};

const options = [
  { label: "28 Days", id: 28 },
  { label: "14 Days", id: 14 },
  { label: "Custom", id: 1 },
];

export const TermPicker = (props: TermPickerProps) => {
  const [id, setId] = useState(props.defaultValue? props.defaultValue.id : options[0].id);
  const [amount, setAmount] = useState(props.defaultValue? props.defaultValue.amount : options[0].id);

  useEffect(() => {
    props.onChange && props.onChange({ id, amount });
  }, [id, amount]);

  const handleChangeSelect = (id: number) => {
    setId(id);
    setAmount(id);
    props.onChange && props.onChange({ id, amount: id });
  };

  const handleChangeInput = (input: number) => {
    setAmount(input);
    props.onChange && props.onChange({ id, amount: input });
  };

  return (
    <div>
      {props.label && <p className="text-xs font-light mb-1">{props.label}</p>}
      <div className="flex gap-1">
        <div className="w-1/4">
          <Select
            value={id}
            defaultValue={props.defaultValue? props.defaultValue.id : options[0].id}
            options={options}
            onChange={handleChangeSelect}
          />
        </div>
        {id === 1 && (
          <div className="w-3/4 mt-1">
            <Input
              value={amount}
              onChange={(event) =>
                handleChangeInput(Number(event.target.value))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
