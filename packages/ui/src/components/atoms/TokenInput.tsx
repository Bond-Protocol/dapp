//import { useState } from "react";
import { Icon, Input, InputProps } from "..";

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

export const TokenInput = (
  props: InputProps & { symbol?: string; icon?: string }
) => {
  //const [value, setValue] = useState(props.value as string);
  //const [showTokenSymbol, setShowTokenSymbol] = useState(true);
  const value = "";
  const setValue = (s: string) => {};
  const showTokenSymbol = true;
  const setShowTokenSymbol = (f: boolean) => {};

  const onBlur = (_e: React.BaseSyntheticEvent) => {
    let updated = value === "" ? "0" : value;
    updated = ""; //longFormatter.format(Number(updated));
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
