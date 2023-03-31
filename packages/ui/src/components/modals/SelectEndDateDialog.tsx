import { useEffect, useState } from "react";
import { Button, DatePicker, FlatSelect } from "..";
import { formatDate } from "utils";
import { ManualDayInput } from "components/molecules/ManualDayInput";

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
}) => {
  const [type, setType] = useState<TermType>(defaultType);
  const [date, setDate] = useState<Date>();
  const [days, setDays] = useState<string>("");
  const [state, setState] = useState({ canSubmit: true });

  const canSubmit = type === "date" ? !!date : state.canSubmit;

  const onChange = (args: { date: Date; invalid?: boolean }) => {
    setDate(args.date);
    setType(type);
  };

  const onManualChange = (days: string, other: any) => {
    setDays(days);
    setState(other);
  };

  const handleTypeChange = (type: TermType) => {
    setType(type);
    setDate(undefined);
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const formattedDate = date && formatDate.short(date);
    const label =
      type === "date"
        ? formattedDate
        : days.includes("days")
        ? days
        : `${days} days`;

    props.onSubmit({ value: { type, date, days }, label });

    props.onClose(e);
  };

  useEffect(() => {
    props.onSubmit({ value: { type, date, days, canSubmit } });
  }, [type, date, days]);

  return (
    <div className="flex flex-col items-center justify-center">
      <FlatSelect
        default={defaultType}
        options={options}
        onChange={handleTypeChange}
      />
      {type === "date" ? (
        <DatePicker showTime onChange={onChange} />
      ) : (
        <ManualDayInput
          startDate={props.startDate}
          defaultValue={days}
          onChange={onManualChange}
          className="mt-4 w-[416px] max-w-[416px] "
        />
      )}
      <div className="flex w-full gap-x-2 pt-4">
        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={(e) => props.onClose(e)}
        >
          Cancel
        </Button>
        <Button
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
