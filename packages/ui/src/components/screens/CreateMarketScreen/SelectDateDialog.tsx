import { useState } from "react";
import { Button, DatePicker } from "../../../components";

export const SelectDateDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  defaultDate?: Date;
  defaultTime?: string;
  limitDate?: Date;
}) => {
  const [date, setDate] = useState<Date>(props.defaultDate ?? new Date());
  const [invalid, setInvalid] = useState<boolean>(
    !props.defaultDate || !!props.defaultTime
  );

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    props.onClose(e);

    props.onSubmit({ value: date });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <DatePicker
        showTime
        to={props.limitDate}
        onChange={({ date, invalid }) => {
          setDate(date);
          setInvalid(!!invalid);
        }}
      />
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
          disabled={invalid}
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
