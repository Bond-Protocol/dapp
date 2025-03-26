import { useState } from "react";
import { useNumericInput } from "../../../hooks";
import { dateMath, formatDate } from "../../../utils";
import { Input } from "../..";

const errorMessage = "Markets can't be longer than 270 days";

export type ManualVestingDayInputProps = {
  limit?: number;
  defaultValue?: string;
  onChange: (date: Date, other?: any) => void;
  className?: string;
  startDate?: Date;
};

export const ManualDayInput = ({
  limit = 270,
  defaultValue,
  className,
  startDate,
  ...props
}: ManualVestingDayInputProps) => {
  const { value: days, setValue: setDays } = useNumericInput();
  const [endDate, setEndDate] = useState<Date>();

  const onChange = (e: React.BaseSyntheticEvent) => {
    if (!startDate) return;
    const { value } = e.target;
    const error = parseFloat(value) > limit;
    const calculatedDate = dateMath.addDays(startDate, parseFloat(value));

    const canSubmit = !!value && !error;

    setEndDate(calculatedDate);
    setDays(value);
    props.onChange(calculatedDate, { canSubmit });
  };

  const error = parseFloat(days) > limit;
  return (
    <div className={"bp-manual-day-input w-full" + " " + className}>
      <Input
        data-testid="market-duration-in-days"
        autoFocus
        errorMessage={error ? errorMessage : ""}
        label="Market Length"
        placeholder="Enter the amount of days to run the market"
        onFocus={() => setDays((value) => value.split(" ")[0])}
        onBlur={() => setDays((value) => value + " days")}
        subText={`Max ${limit} days`}
        value={days !== "0" ? days : ""}
        onChange={onChange}
      />
      <div className="flex flex-col items-center justify-center p-8 pb-6">
        <h4 className="font-fraktion text-5xl font-bold">
          {endDate && formatDate.short(endDate) !== "invalid"
            ? formatDate.short(endDate)
            : ""}
        </h4>
        <p className="text-light-grey font-fraktion font-bold">END DATE</p>
      </div>
    </div>
  );
};
