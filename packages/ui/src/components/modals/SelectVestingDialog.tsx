import { useState } from "react";
import { Button, DatePicker, FlatSelect } from "..";

const options = [
  { label: "DATE", value: "date" },
  { label: "TERM", value: "term" },
];

type TermTypes = "term" | "date";

export const SelectVestingDialog = (props: {
  onChange: Function;
  onCancel?: Function;
}) => {
  const [type, setType] = useState<TermTypes>("date");

  const onChange = (date?: Date) => {
    console.log("TokenPickerDialog onChange ", { type, date });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <FlatSelect
        default="date"
        options={options}
        onChange={(v) => {
          console.log({ v });
          setType(v);
        }}
      />
      {type === "date" ? <DatePicker onChange={onChange} /> : <div />}
      <div className="flex w-full gap-x-2 pt-4">
        <Button variant="ghost" size="lg" className="w-full">
          Cancel
        </Button>
        <Button size="lg" className="w-full">
          Select
        </Button>
      </div>
    </div>
  );
};
