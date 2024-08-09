import { useState } from "react";
import { formatDate } from "utils";
import { Button, DatePicker, FlatSelect, Link } from "components";
import { ManualVestingTermInput } from "./";
import React from "react";

type TermType = "term" | "date";

const defaultType = "term";

export const SelectVestingDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  disableFixedExpiry: boolean;
}) => {
  const [type, setType] = useState<TermType>(defaultType);
  const [date, setDate] = useState<Date>();
  const [days, setDays] = useState<string>("");
  const [state, setState] = useState({ canSubmit: true });
  const canSubmit = type === "date" ? !!date : state.canSubmit;

  const options = React.useMemo(() => {
    const options = [
      { label: "LENGTH", value: "term" },
      { label: "DATE", value: "date" },
    ];

    if (props.disableFixedExpiry) options.pop();
    return options;
  }, [props.disableFixedExpiry]);

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
    const formattedDate = date && formatDate.shorter(date);
    const label =
      type === "date"
        ? formattedDate
        : days.includes("days")
        ? days
        : `${days} days`;

    props.onSubmit({
      value: { type, value: type === "date" ? date : days },
      label,
    });

    props.onClose(e);
  };

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
      <Link className="-mb-1 mt-4 font-mono text-sm">CUSTOM VESTING FAQ</Link>
    </div>
  );
};
