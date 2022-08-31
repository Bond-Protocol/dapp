import {
  InputUnstyled,
  InputUnstyledProps,
  ClickAwayListener,
} from "@mui/base";
import { forwardRef, useState } from "react";
import editIcon from "../../assets/icons/edit-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

export type TokenInput = {
  symbol?: string;
  logo?: string;
  className?: string;
  labelClassName?: string;
  value?: string;
  subText?: string;
  label?: string;
  editing?: boolean;
};

export const TokenInput = forwardRef(function TokenInput(
  { className, ...props }: InputUnstyledProps & TokenInput,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [value, setValue] = useState(props.value || "0.00");
  const [editing, setEditing] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    props.onChange && props.onChange(e);
  };

  const handleClose = () => {
    if (value === "" || isNaN(parseInt(value))) {
      setValue("0.00");
    }
    setEditing(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {props.label && (
        <p
          className={`font-extralight font-jakarta tracking-wide mb-1 ${props.labelClassName}`}
        >
          {props.label}
        </p>
      )}
      <ClickAwayListener onClickAway={handleClose}>
        <div className="flex justify-between px-4 py-2 border rounded-lg ">
          <div className="flex w-full">
            {props.logo && <img src={props.logo} width={24} />}
            {editing ? (
              <InputUnstyled
                {...props}
                onChange={(e) => handleChange(e)}
                ref={ref}
                value={value}
                componentsProps={{
                  root: {
                    className: "",
                  },
                  input: {
                    className:
                      "font-jakarta w-[100%] bg-transparent focus:outline-none",
                  },
                }}
              />
            ) : (
              <p className="font-jakarta">
                {value + " " + (props.symbol || "")}
              </p>
            )}
          </div>
          {!props.disabled && !props.editing && (
            <img
              src={editing ? closeIcon : editIcon}
              onClick={() =>
                editing ? handleClose() : setEditing((prev) => !prev)
              }
              className="hover:cursor-pointer"
            />
          )}
        </div>
      </ClickAwayListener>
      {props.subText && (
        <p className="text-xs font-faketion font-light text-light-grey mt-1">
          {props.subText}
        </p>
      )}
    </div>
  );
});
