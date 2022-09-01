import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import { getUserLocale } from "../../utils/getLocale";
import { ClickAwayListener } from "@mui/base";

export type DatePickerProps = {
  onChange?: (date?: Date) => void;
  className?: string;
  dateClassName?: string;
  label?: string;
  string?: string;
  placeholder?: string;
};

export const DatePicker = ({ onChange, ...props }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const locale = getUserLocale() || "en-US";
  const formattedDate = new Intl.DateTimeFormat(locale).format(date);

  const handleClose = (date: unknown) => {
    setDate(date as Date);
    setOpen(false);
    onChange && onChange(date as Date);
  };

  useEffect(() => {
    onChange && onChange(date);
  }, [onChange, date]);

  return (
    <ClickAwayListener onClickAway={() => handleClose(date)}>
      <div className={props.className} onClick={() => setOpen((prev) => !prev)}>
        {props.label && <p>{props.label}</p>}
        <div
          className={`px-4 h-10 py-2 border rounded-lg hover:cursor-pointer ${props.dateClassName}`}
        >
          <p>{date ? formattedDate : props.placeholder}</p>
        </div>
        {open && (
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            className="absolute p-3 backdrop-blur-xl border rounded-lg z-10"
          />
        )}
      </div>
    </ClickAwayListener>
  );
};
