import { DayPicker, DayPickerProps } from "react-day-picker";
import { useEffect, useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-slim.svg";
import ClockIcon from "../../assets/icons/clock.svg";

import { Input } from "..";
import { useTimeInput } from "../../hooks/use-time-input";
import { dateMath } from "../../utils";

const styleOverride = {
  root: "rdp m-0",
  caption_label: "font-light",
  button_reset: "",
  weeknumber: "",
  day: "rdp-day !rounded-md",
  nav_button:
    "rdp-nav_button border-none fill-white hover:fill-light-secondary cursor-pointer",
  button:
    "border border-transparent hover:border-white rounded-md disabled:text-light-grey disabled:border-none",
  day_selected: "bg-light-primary",
};

const getDayFirstLetter = (date = new Date(), locale = "en-US") => {
  return date.toLocaleDateString(locale, { weekday: "long" }).substring(0, 1);
};

export const DatePicker = (
  props: DayPickerProps & {
    onChange: (args: { date: Date; invalid?: boolean }) => void;
    showTime?: boolean;
    className?: string;
    defaultDate?: Date;
    defaultTime?: string;
    from?: Date;
    to?: Date;
  }
) => {
  const [date, setDate] = useState<Date>();
  const { time, setTime, matcher } = useTimeInput(props.defaultTime);

  const fromDate = props.from ?? new Date();
  const toDate = props.to ?? dateMath.addDays(new Date(), 270);

  useEffect(() => {
    if (!props.showTime) return;

    //Update date with time once its typed
    if (matcher.test(time) && date) {
      const fullDate = dateMath.addTimeToDate(date, time);
      const invalid = dateMath.isBefore(fullDate, new Date());
      setDate(fullDate);
      props.onChange({ date: fullDate, invalid });
    }
  }, [props.showTime, time]);

  const onSelect = (date?: Date) => {
    const nextDate = date ?? new Date();
    setDate(nextDate);

    props.onChange({
      date: nextDate,
      invalid: props.showTime && !matcher.test(time),
    });
  };

  const isInThePast =
    props.showTime &&
    matcher.test(time) &&
    dateMath.isBefore(dateMath.addTimeToDate(date, time), new Date());

  return (
    <div className={props.className ?? ""}>
      <DayPicker
        fixedWeeks
        showOutsideDays
        mode="single"
        selected={date}
        fromDate={fromDate}
        toDate={toDate}
        onSelect={onSelect}
        classNames={styleOverride}
        formatters={{
          formatWeekdayName: (date) => getDayFirstLetter(date),
        }}
        components={{
          IconLeft: () => <img src={ArrowDownIcon} />,
          IconRight: () => <img src={ArrowDownIcon} className="rotate-180" />,
        }}
      />
      {props.showTime && (
        <Input
          className="time-picker mt-2"
          placeholder="00:00"
          errorMessage={isInThePast ? "That date is in the past 👀 " : ""}
          value={time}
          onChange={(e) => setTime(e)}
          startAdornment={<img src={ClockIcon} className="ml-2" />}
        />
      )}
    </div>
  );
};
