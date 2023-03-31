import { useState } from "react";

import { Button, DatePicker } from "..";

export const SelectDateDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  defaultDate?: Date;
  defaultTime?: string;
}) => {
  const [date, setDate] = useState<Date>(props.defaultDate ?? new Date());
  const [invalid, setInvalid] = useState<boolean>(
    !props.defaultDate || !!props.defaultTime
  );

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    props.onClose(e);

    props.onSubmit(date);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <DatePicker
        showTime
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
