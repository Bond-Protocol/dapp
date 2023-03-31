import { useEffect, useState } from "react";
import { ReactComponent as ClockIcon } from "assets/icons/clock.svg";

import { Button, DatePicker, Input } from "..";
import { useTimeInput } from "hooks/use-time-input";
import { dateMath } from "utils";

export const SelectDateDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  defaultDate?: Date;
  defaultTime?: string;
}) => {
  const [date, setDate] = useState<Date>(props.defaultDate ?? new Date());
  const { time, setTime, matcher } = useTimeInput(props.defaultTime);

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    props.onClose(e);

    props.onSubmit(date);
  };

  useEffect(() => {
    //Update date with time once its typed
    if (matcher.test(time) && date) {
      const fullDate = dateMath.addTimeToDate(date, time);
      setDate(fullDate);
    }
  }, [time]);

  const isInThePast =
    matcher.test(time) &&
    dateMath.isBefore(dateMath.addTimeToDate(date, time), new Date());

  return (
    <div className="flex flex-col items-center justify-center">
      <DatePicker onChange={setDate} />
      <Input
        className="mt-2"
        placeholder="16:00"
        errorMessage={isInThePast && "That time is in the past 👀"}
        value={time}
        onChange={(e) => setTime(e)}
        startAdornment={<ClockIcon className="ml-2" />}
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
        <Button onClick={handleSubmit} size="lg" className="w-full">
          Select
        </Button>
      </div>
    </div>
  );
};
