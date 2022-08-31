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
      className={`border border-light-neutral rounded-full flex items-center w-6 h-6 ${
        disabled ? "opacity-80" : "hover:cursor-pointer"
      }`}
    >
      <div
        className={`mx-auto transition-all relative bg-light-primary-500 rounded-full w-[14px] h-[14px] ${
          checked ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
};
