import { useEffect, useState } from "react";
import { useNumericInput } from "hooks/use-numeric-input";
import { dateMath, formatDate } from "utils";
import { Input } from "..";

const errorMessage = "Markets can't be longer than 270 days";

export type ManualVestingTermInputProps = {
  limit?: number;
  defaultValue?: string;
  onChange: (value: string, other?: any) => void;
  className?: string;
  startDate: Date;
};

export const ManualDayInput = ({
  limit = 270,
  defaultValue,
  className,
  startDate,
  ...props
}: ManualVestingTermInputProps) => {
  const { value: days, setValue: setDays } = useNumericInput();
  const [endDate, setEndDate] = useState<Date>();

  const onChange = (e: React.BaseSyntheticEvent) => {
    const { value } = e.target;

    const error = parseFloat(value) > limit;
    const canSubmit = !!value && !error;
    const calculatedDate = dateMath.addDays(startDate, parseFloat(value));
    console.log({ limit, value, error, canSubmit });

    setEndDate(calculatedDate);
    setDays(value);
    props.onChange(value, { canSubmit });
  };

  const error = parseFloat(days) > limit;
  return (
    <div className={"w-full" + " " + className}>
      <Input
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
