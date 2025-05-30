import { useEffect, useState } from "react";
import { Checkbox, Input } from "../..";
import { useNumericInput } from "../../../hooks/use-numeric-input";

const VestingWarning = ({ value }: { value: string }) => (
  <div>
    {value} days seems like an excessive vesting term. <br /> Please make sure
    you know what you're doing.
  </div>
);

const LengthWarning = () => (
  <div className="text-light-grey pt-1 font-mono text-sm">
    Your selected vesting terms go beyond the usual. This might deter people
    from purchasing your bond and you could be facing high discounts.
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
  const { value, setValue } = useNumericInput();
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
    if (error) {
      setAcceptedWarning(false);
      props.onChange(value, { canSubmit: !error });
    }
  }, [error, acceptedWarning, warning]);

  return (
    <div className={"w-full" + " " + className}>
      <Input
        autoFocus
        errorMessage={error ? errorMessage : ""}
        label="Market Length"
        placeholder="Enter the amount of vesting days"
        onFocus={() => setValue((value) => value.split(" ")[0])}
        onBlur={() => setValue((value) => value + " days")}
        subText={
          error ? (
            ""
          ) : warning ? (
            <VestingWarning value={value} />
          ) : (
            `Max ${limit} days`
          )
        }
        rootClassName={warning ? "border-light-secondary" : ""}
        subTextClassName={warning ? "text-light-secondary" : ""}
        value={value !== "0" ? value : ""}
        onChange={onChange}
      />
      {warning && (
        <div className="pt-4">
          <Checkbox
            label="I understand"
            startChecked={acceptedWarning}
            onChange={setAcceptedWarning}
          />
          <LengthWarning />
        </div>
      )}
    </div>
  );
};
