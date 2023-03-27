import { useEffect, useState } from "react";
import { useNumericInput } from "hooks/use-numeric-input";
import { Checkbox, Input } from "..";

const VestingWarning = ({ value }: { value: string }) => (
  <div>
    {value} days seems like an excessive vesting term. <br /> Please make sure
    you know what you're doing.
  </div>
);

const errorMessage = "Vesting time can't be longer than 270 days";

export type ManualVestingTermInputProps = {
  limit?: number;
  maxRecommended?: number;
  defaultValue?: string;
  onChange: (value: string, other?: any) => void;
  className?: string;
};

export const ManualVestingTermInput = ({
  limit = 270,
  maxRecommended = 30,
  defaultValue = "7",

  className,
  ...props
}: ManualVestingTermInputProps) => {
  const { value, setValue } = useNumericInput(defaultValue + " days");
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  const error = parseFloat(value) > limit;
  const warning = !error && parseFloat(value) > maxRecommended;

  const onChange = (e: React.BaseSyntheticEvent) => {
    const { value } = e.target;

    const warning = !error && parseFloat(value) > maxRecommended;
    const canSubmit = !!value && !error && (warning ? acceptedWarning : true);

    setValue(value);
    props.onChange(value, { canSubmit });
  };

  useEffect(() => {
    if (warning) {
      props.onChange(value, { canSubmit: acceptedWarning });
    }
  }, [error, acceptedWarning, warning]);

  return (
    <div className={"w-full" + " " + className}>
      <Input
        errorMessage={error ? errorMessage : ""}
        label="Vesting Term"
        onFocus={() => setValue((value) => value.split(" ")[0])}
        onBlur={() => setValue((value) => value + " days")}
        subText={
          error ? (
            ""
          ) : warning ? (
            <div>
              {value} days seems like an excessive vesting term. <br /> Please
              make sure you know what you're doing.
            </div>
          ) : (
            `Max ${limit} days`
          )
        }
        rootClassName={warning ? "border-light-secondary" : ""}
        subTextClassName={warning ? "text-light-secondary" : ""}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
