import { useEffect, useState } from "react";
import { useNumericInput } from "hooks/use-numeric-input";
import { Checkbox, Input } from "..";
import { formatDate } from "utils";

const VestingWarning = ({ value }: { value: string }) => (
  <div>
    {value} days seems like an excessive vesting term. <br /> Please make sure
    you know what you're doing.
  </div>
);

const errorMessage = "Vesting time can't be longer than 270 days";

export type ManualVestingTermInputProps = {
  limit?: number;
  defaultValue?: string;
  onChange: (value: string, other?: any) => void;
  className?: string;
};

export const ManualDayInput = ({
  limit = 270,
  defaultValue,
  className,
  ...props
}: ManualVestingTermInputProps) => {
  const { value, setValue } = useNumericInput();

  const error = parseFloat(value) > limit;

  const onChange = (e: React.BaseSyntheticEvent) => {
    const { value } = e.target;

    const canSubmit = !!value && !error;

    setValue(value);
    props.onChange(value, { canSubmit });
  };

  return (
    <div className={"w-full" + " " + className}>
      <Input
        errorMessage={error ? errorMessage : ""}
        label="Market Length"
        placeholder="Enter the amount of days to run the market"
        onFocus={() => setValue((value) => value.split(" ")[0])}
        onBlur={() => setValue((value) => value + " days")}
        subText={`Max ${limit} days`}
        value={value !== "0" ? value : ""}
        onChange={onChange}
      />
      <div className="flex items-center justify-center p-8">
        <h4>{formatDate.short(new Date())}</h4>
        <p>End Date</p>
      </div>
    </div>
  );
};
