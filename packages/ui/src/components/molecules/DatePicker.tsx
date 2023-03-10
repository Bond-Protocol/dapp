import PopperUnstyled from "@mui/base/PopperUnstyled";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import { ClickAwayListener } from "@mui/base";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";

export type DatePickerProps = {
  onChange?: (date?: number) => void;
  errorMessage?: string;
  className?: string;
  dateClassName?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: Date;
  id?: string;
};

export const DatePicker = ({ onChange, ...props }: DatePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [date, setDate] = useState<Date>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-popper" : undefined;

  const fromDate = new Date();
  const toDate = new Date(Date.now() + 270 * 24 * 60 * 60 * 1000);

  const formattedDate =
    date &&
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

  const handleClose = (date: unknown) => {
    if (date instanceof Date && !isNaN(date.valueOf())) {
      setDate(date);
      onChange && onChange(date?.getTime() / 1000);
      setAnchorEl(null);
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
    <ClickAwayListener onClickAway={(e: unknown) => handleClose(date)}>
      <div id={props.id}>
        <div id={id} className={props.className} onClick={handleClick}>
          {props.label && (
            <p className="font-jakarta mb-1 text-xs font-light">
              {props.label}
            </p>
          )}
          <div
            className={`flex h-10 justify-between rounded-lg border px-3 py-2 hover:cursor-pointer ${
              props.dateClassName
            } ${props.errorMessage && "border-red-500 bg-red-500"}`}
          >
            <p
              className={`${date ? "font-bold" : ""} font-jakarta text-[15px]`}
            >
              {date ? formattedDate : props.placeholder}
            </p>
            <CalendarIcon className="color-white my-auto" />
          </div>
        </div>
        <PopperUnstyled open={open} anchorEl={anchorEl}>
          <div className="m-2 rounded-md border bg-white/5 backdrop-blur-md">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleClose}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>
        </PopperUnstyled>
      </div>
    </ClickAwayListener>
  );
};
