import CheckmarkIcon from "../../assets/icons/checkmark.svg?react";
import { useState } from "react";

export type CheckboxProps = {
  label?: string;
  disabled?: boolean;
  startChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  labelClassname?: string;
  id?: string;
};
export const Checkbox = ({
  id,
  startChecked = false,
  disabled,
  onChange,
  className,
  labelClassname,
  label,
  ...props
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
        className={`border-light-neutral flex h-5 w-5 items-center border ${
          disabled ? "opacity-80" : "hover:cursor-pointer"
        } ${className}`}
        {...props}
      >
        <div
          className={`flex w-full items-center justify-center transition-all ${
            checked ? "opacity-100" : "opacity-0"
          } `}
        >
          <CheckmarkIcon className="fill-white" />
        </div>
      </div>
      {label && (
        <p className={"mt-1 pl-2 text-sm" + " " + labelClassname}>{label}</p>
      )}
    </div>
  );
};
