import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-slim.svg";

const getDayFirstLetter = (date = new Date(), locale = "en-US") => {
  return date.toLocaleDateString(locale, { weekday: "long" }).substring(0, 1);
};

export const DatePicker = (props: {
  onChange: (date?: Date) => void;
  className?: string;
}) => {
  const [date, setDate] = useState<Date>();

  const fromDate = new Date();
  const toDate = new Date(Date.now() + 270 * 24 * 60 * 60 * 1000);

  const onSelect = (date?: Date) => {
    setDate(date);
    props.onChange(date);
  };

  return (
    <div className={props.className ?? ""}>
      <DayPicker
        mode="single"
        selected={date}
        fromDate={fromDate}
        toDate={toDate}
        onSelect={onSelect}
        formatters={{
          formatWeekdayName: (date) => getDayFirstLetter(date),
        }}
        components={{
          IconLeft: () => <ArrowDownIcon />,
          IconRight: () => <ArrowDownIcon className="rotate-180" />,
        }}
        classNames={{
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
        }}
      />
    </div>
  );
};
