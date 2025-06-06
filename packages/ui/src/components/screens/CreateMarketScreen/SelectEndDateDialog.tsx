import { useState } from "react";
import { dateMath } from "../../../utils";
import {
  Button,
  DatePicker,
  FlatSelect,
  ManualDayInput,
} from "../../../components";

const options = [
  { label: "LENGTH", value: "term" },
  { label: "DATE", value: "date" },
];

type TermType = "term" | "date";

const defaultType = "term";
export const SelectEndDateDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  startDate: Date;
  id?: string;
}) => {
  const [type, setType] = useState<TermType>(defaultType);
  const [date, setDate] = useState<Date>();
  const [state, setState] = useState({ canSubmit: true });

  const canSubmit = type === "date" ? !!date : state.canSubmit;

  const onDateChange = (args: { date: Date; invalid?: boolean }) => {
    setDate(args.date);
    setType("date");
  };

  const onDayChange = (date: Date, other: any) => {
    setDate(date);
    setType("term");
    setState(other);
  };

  const handleTypeChange = (type: TermType) => {
    setType(type);
    setDate(undefined);
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    props.onSubmit(date);
    props.onClose(e);
  };

  return (
    <div id={props.id} className="flex flex-col items-center justify-center">
      <FlatSelect
        default={defaultType}
        options={options}
        onChange={handleTypeChange}
      />
      {type === "date" ? (
        <DatePicker
          showTime
          from={dateMath.addDays(props.startDate, 1)}
          onChange={onDateChange}
        />
      ) : (
        <ManualDayInput
          startDate={props.startDate}
          onChange={onDayChange}
          className="mt-4 w-[416px] max-w-[416px] "
        />
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
          disabled={!canSubmit}
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
