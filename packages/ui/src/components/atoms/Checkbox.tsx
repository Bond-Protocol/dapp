import { ReactComponent as CheckmarkIcon } from "assets/icons/checkmark.svg";
import { useEffect, useState } from "react";

export type CheckboxProps = {
  label?: string;
  disabled?: boolean;
  startChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
};
export const Checkbox = ({
  id,
  startChecked = false,
  disabled,
  onChange,
  className,
  label,
}: CheckboxProps) => {
  const [checked, setChecked] = useState(startChecked);

  const toggle = () => {
    setChecked((prev) => {
      const updated = !prev;

      onChange && onChange(updated);

      return updated;
    });
  };

  return (
    <div className="flex items-center">
      <div
        id={id}
        onClick={!disabled ? toggle : () => {}}
        className={`border-light-neutral flex h-6 w-6 items-center border ${
          disabled ? "opacity-80" : "hover:cursor-pointer"
        } ${className}`}
      >
        <div
          className={`flex w-full items-center justify-center transition-all ${
            checked ? "opacity-100" : "opacity-0"
          } `}
        >
          <CheckmarkIcon className="fill-white" />
        </div>
      </div>
      {label && <p className="pl-2 text-sm">{label}</p>}
    </div>
  );
};
