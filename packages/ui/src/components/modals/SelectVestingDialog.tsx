import { ManualVestingTermInput } from "components/molecules/ManualVestingTermInput";
import { useEffect, useState } from "react";
import { Button, DatePicker, FlatSelect, Link } from "..";
import { formatDate } from "utils";

const options = [
  { label: "LENGTH", value: "term" },
  { label: "DATE", value: "date" },
];

type TermType = "term" | "date";

const defaultType = "term";
export const SelectVestingDialog = (props: {
  onSubmit: Function;
  onClose: Function;
}) => {
  const [type, setType] = useState<TermType>(defaultType);
  const [date, setDate] = useState<Date>();
  const [days, setDays] = useState<string>("");
  const [state, setState] = useState({ canSubmit: true });

  const canSubmit = type === "date" ? !!date : state.canSubmit;

  const onChange = ({ date }: { date: Date }) => {
    setDate(date);
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
        <DatePicker onChange={onChange} />
      ) : (
        <ManualVestingTermInput
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
      <Link className="mt-4 -mb-1 font-mono text-sm">CUSTOM VESTING FAQ</Link>
    </div>
  );
};
