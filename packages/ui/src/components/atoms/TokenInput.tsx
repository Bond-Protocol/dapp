import { useEffect, useState } from "react";
import { Icon, Input, InputProps } from "..";

export type TokenInputProps = InputProps & {
  symbol?: string;
  icon?: string;
  labelClassName?: string;
  editing?: boolean;
  symbolStartsShowing?: boolean;
};

export const TokenInput = (props: TokenInputProps) => {
  const [value, setValue] = useState(props.value);
  const [showTokenSymbol, setShowTokenSymbol] = useState(
    props.symbolStartsShowing
  );

  useEffect(() => {
    setValue(value);
  }, [props.value]);

  const onBlur = (_e: React.BaseSyntheticEvent) => {
    let updated = value === "" ? "0" : value;
    //updated = longFormatter.format(Number(updated));
    setValue(updated);
    setShowTokenSymbol(true);
  };

  const onFocus = (_e: React.BaseSyntheticEvent) => {
    setShowTokenSymbol(false);
    let updated = Number(String(value).replace(/[^0-9.-]+/g, ""));
    let checked = isNaN(updated) || updated === 0 ? "" : updated.toString();
    setValue(checked);
  };

  const onChange = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const nextValue = e.target.value;

    if (!isNaN(Number(nextValue))) {
      // @ts-ignore
      props.onChange && props.onChange(nextValue);
      // @ts-ignore
      setValue(nextValue);
    }
  };
  const displayValue = showTokenSymbol
    ? `${value} ${props.symbol ?? ""}`
    : value;

  return (
    <Input
      {...props}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      value={Number(value) === 0 ? null : displayValue}
      label={props.label}
      startAdornment={
        props.icon && <Icon className="pl-2" width={24} src={props.icon} />
      }
    />
  );
};
