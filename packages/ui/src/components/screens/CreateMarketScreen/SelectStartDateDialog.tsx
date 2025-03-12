import { useState } from "react";
import { dateMath } from "utils";
import { Button, DatePicker, FlatSelect, ManualDayInput } from "components";

const options = [
  { label: "IMMEDIATE", value: "immediate" },
  { label: "DATE", value: "date" },
];

type StartType = "immediate" | "date";

const defaultType = "immediate";
export const SelectStartDateDialog = (props: {
  onSubmit: Function;
  onConfirmImmediate: Function;
  onClose: Function;
  id?: string;
}) => {
  const [startType, setStartType] = useState<StartType>(defaultType);
  const [date, setDate] = useState<Date>();
  const [state, setState] = useState({ canSubmit: true });

  const onDateChange = (args: { date: Date; invalid?: boolean }) => {
    setDate(args.date);
    setStartType("date");
  };

  const handleTypeChange = (type: StartType) => {
    setStartType(type);
    setDate(undefined);
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (startType !== "immediate") {
      props.onSubmit(date);
    } else {
      props.onConfirmImmediate();
    }
    props.onClose(e);
  };

  return (
    <div id={props.id} className="flex flex-col items-center justify-center">
      <FlatSelect
        default={defaultType}
        options={options}
        onChange={handleTypeChange}
      />
      {startType === "date" ? (
        <DatePicker showTime onChange={onDateChange} />
      ) : (
        <div className="w-[400px] p-2">
          <div className="text-light-grey-400">
            <span className="mr-0.5 font-bold text-white">IMMEDIATE</span>
            <p className="pt-2">
              If you would like your market to open as soon as possible, we
              recommend choosing the Immediate option.
            </p>
            <p className="pt-1">
              If you would like to open your market at a specific date and time,
              please ensure that you leave enough time to execute the create
              market transaction, as it will fail if the date you specify is in
              the past at the time of execution.
            </p>
          </div>
        </div>
      )}
      <div className="flex w-full gap-x-2 pt-4">
        <Button
          data-testid="date-cancel-button"
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={(e) => props.onClose(e)}
        >
          Cancel
        </Button>
        <Button
          data-testid="date-select-button"
          onClick={handleSubmit}
          size="lg"
          className="w-full"
        >
          Select
        </Button>
      </div>
    </div>
  );
};
