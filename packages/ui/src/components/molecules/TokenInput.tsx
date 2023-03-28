import {
  InputUnstyled,
  InputUnstyledProps,
  ClickAwayListener,
} from "@mui/base";
import { forwardRef, useState } from "react";
import editIcon from "../../assets/icons/edit-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";
import { Icon, Input, InputProps } from "..";
import { longFormatter } from "utils";

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
          className={`font-jakarta mb-1 font-extralight tracking-wide ${props.labelClassName}`}
        >
          {props.label}
        </p>
      )}
      <ClickAwayListener onClickAway={handleClose}>
        <div className="flex justify-between rounded-lg border px-4 py-2 ">
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
        <div className="font-faketion text-light-grey mt-1 text-xs font-light">
          {props.subText}
        </div>
      )}
    </div>
  );
});

export const TokenAmountInput = (
  props: InputProps & { symbol?: string; icon?: string }
) => {
  const [value, setValue] = useState(props.value as string);
  const [showTokenSymbol, setShowTokenSymbol] = useState(true);

  const onBlur = (_e: React.BaseSyntheticEvent) => {
    let updated = value === "" ? "0" : value;
    updated = longFormatter.format(Number(updated));
    setValue(updated);
    setShowTokenSymbol(true);
  };

  const onFocus = (_e: React.BaseSyntheticEvent) => {
    setShowTokenSymbol(false);
    let updated = Number(value.replace(/[^0-9.-]+/g, ""));
    let checked = isNaN(updated) || updated === 0 ? "" : updated.toString();

    setValue(checked);
  };

  const onChange = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    const updated = e.target.value;

    if (!isNaN(updated)) {
      props.onChange && props.onChange(updated);
      setValue(updated);
    }
  };

  return (
    <Input
      {...props}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      value={showTokenSymbol ? `${value} ${props.symbol}` : value}
      label={props.label}
      startAdornment={
        props.icon && <Icon className="pl-2" width={24} src={props.icon} />
      }
    />
  );
};
