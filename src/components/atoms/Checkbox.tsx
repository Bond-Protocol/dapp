import { useEffect, useState } from "react";

export type CheckboxProps = {
  disabled?: boolean;
  startChecked?: boolean;
  onChange?: (checked: boolean) => void;
};
export const Checkbox = ({
  startChecked = false,
  disabled,
  onChange,
}: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    onChange && onChange(!checked);
    setChecked(!checked);
  };

  useEffect(() => {
    onChange && onChange(startChecked);
    setChecked(startChecked);
  }, [onChange, startChecked]);

  return (
    <div
      onClick={!disabled ? toggle : () => {}}
      className={`flex h-6 w-6 items-center rounded-full border border-light-neutral ${
        disabled ? "opacity-80" : "hover:cursor-pointer"
      }`}
    >
      <div
        className={`relative mx-auto h-[14px] w-[14px] rounded-full bg-light-primary-500 transition-all ${
          checked ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
};
