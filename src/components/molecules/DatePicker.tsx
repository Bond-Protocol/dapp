import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import { ClickAwayListener } from "@mui/base";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";

export type DatePickerProps = {
  onChange?: (date?: number) => void;
  className?: string;
  dateClassName?: string;
  label?: string;
  string?: string;
  placeholder?: string;
  defaultValue?: Date;
};

export const DatePicker = ({ onChange, ...props }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const fromDate = new Date();
  const toDate = new Date(Date.now() + 270 * 24 * 60 * 60 * 1000);

  const formattedDate =
    date &&
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

  const handleClose = (date: unknown) => {
    if (date instanceof Date && !isNaN(date.valueOf())) {
      setDate(date as Date);
      setOpen(false);
      onChange && onChange((date as Date)?.getTime() / 1000);
    }
  };

  useEffect(() => {
    if (
      !date &&
      props.defaultValue instanceof Date &&
      !isNaN(props.defaultValue.valueOf())
    ) {
      setDate(props.defaultValue);
    }
  }, [props.defaultValue]);

  useEffect(() => {
    onChange && onChange((date as Date)?.getTime() / 1000);
  }, [onChange, date]);

  return (
    <ClickAwayListener onClickAway={() => handleClose(date)}>
      <div>
        <div
          className={props.className}
          onClick={() => setOpen((prev) => !prev)}
        >
          {props.label && (
            <p className="mb-1 font-jakarta text-xs font-light">
              {props.label}
            </p>
          )}
          <div
            className={`flex h-10 justify-between rounded-lg border px-3 py-2 hover:cursor-pointer ${props.dateClassName}`}
          >
            <p
              className={`${date ? "font-bold" : ""} font-jakarta text-[15px]`}
            >
              {date ? formattedDate : props.placeholder}
            </p>
            <CalendarIcon className="color-white my-auto" />
          </div>
        </div>
        {open && (
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleClose}
            fromDate={fromDate}
            toDate={toDate}
            className="absolute z-10 rounded-lg border p-3 font-jakarta text-xs backdrop-blur-xl"
          />
        )}
      </div>
    </ClickAwayListener>
  );
};
