import { useEffect, useState } from "react";
import { Button, DatePicker } from "..";
import { formatDate } from "utils";

type TermType = "term" | "date";

const defaultType = "term";
export const SelectDateDialog = (props: {
  onSubmit: Function;
  onClose: Function;
}) => {
  const [type, setType] = useState<TermType>(defaultType);
  const [date, setDate] = useState<Date>();

  const canSubmit = !!date;

  const onChange = (date?: Date) => {
    setDate(date);
    setType(type);
  };

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const label = date && formatDate.short(date);
    props.onSubmit({ value: { type, date }, label });

    props.onClose(e);
  };

  useEffect(() => {
    props.onSubmit({ value: { type, date, canSubmit } });
  }, [type, date]);

  return (
    <div className="flex flex-col items-center justify-center">
      <DatePicker onChange={onChange} />
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
