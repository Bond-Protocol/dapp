import { useState } from "react";
import { useNumericInput } from "hooks/use-numeric-input";
import { Checkbox, Input } from "..";

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

export type ManualVestingTermInputProps = {
  limit?: number;
  maxRecommended?: number;
  defaultValue?: string;
  onSubmit: (value: string) => void;
};

export const ManualVestingTermInput = ({
  limit = 270,
  maxRecommended = 30,
  defaultValue = "7",
  onSubmit,
}: ManualVestingTermInputProps) => {
  const { value, setValue } = useNumericInput(defaultValue);
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  const warning = parseFloat(value) > maxRecommended;

  const onChange = (e: React.BaseSyntheticEvent) => {
    const { value } = e.target;

    if (warning && !acceptedWarning) return;

    onSubmit(value);
    setValue(value);
  };

  return (
    <div>
      <Input
        label="Vesting Terms"
        subText={
          warning ? <VestingWarning value={value} /> : `Max ${limit} days`
        }
        rootClassName={warning ? "border-light-secondary" : ""}
        subTextClassName={warning ? "text-light-secondary" : ""}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {warning && (
        <div className="pt-4">
          <Checkbox label="I understand" onChange={setAcceptedWarning} />
          <LengthWarning />
        </div>
      )}
    </div>
  );
};
