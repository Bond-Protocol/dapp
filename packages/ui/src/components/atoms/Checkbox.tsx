import { useEffect, useState } from "react";

export type CheckboxProps = {
  disabled?: boolean;
  startChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};
export const Checkbox = ({
  startChecked = false,
  disabled,
  onChange,
  className,
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
      className={`border-light-neutral flex h-6 w-6 items-center rounded-full border ${
        disabled ? "opacity-80" : "hover:cursor-pointer"
      } ${className}`}
    >
      <div
        className={`bg-light-primary-500 relative mx-auto h-[14px] w-[14px] rounded-full transition-all ${
          checked ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
};
