import { Select } from "./Select";
import { Input } from "./Input";
import { useEffect, useState } from "react";

export type TimeTypePickerProps = {
  className?: string;
  label?: string;
  onChange?: (time: { amount: string; id: string }) => void;
};

const options = [
  { label: "Minute(s)", id: "mi" },
  { label: "Hour(s)", id: "h" },
  { label: "Day(s)", id: "d" },
  { label: "Weeks(s)", id: "w" },
  { label: "Months(s)", id: "m" },
  { label: "Years(s)", id: "m" },
];

export const TimeTypePicker = (props: TimeTypePickerProps) => {
  const [state, setState] = useState({ amount: "", id: "d" });

  const handleAmount = (e: React.BaseSyntheticEvent) => {
    setState((prev) => {
      const newState = { ...prev, amount: e.target.value };
      props.onChange && props.onChange(newState);
      return newState;
    });
  };

  const handleType = (type?: string | null) => {
    setState((prev) => {
      const newState = { ...prev, id: type || "" };
      props.onChange && props.onChange(newState);
      return newState;
    });
  };

  return (
    <div>
      {props.label && <p className="">{props.label}</p>}
      <div className="flex gap-1">
        <div className="w-3/4 mt-1">
          <Input value={state.amount} onChange={handleAmount} />
        </div>
        <div className="w-1/4">
          <Select
            value={state.id}
            options={options}
            defaultValue="d"
            onChange={handleType}
          />
        </div>
      </div>
    </div>
  );
};
