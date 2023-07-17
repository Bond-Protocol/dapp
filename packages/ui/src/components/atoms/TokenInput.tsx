import { useEffect, useState } from "react";
import { Icon, Input, InputProps } from "..";
import { calculateTrimDigits, longFormatter, trim, trimAsNumber } from "utils";

export type TokenInputProps = InputProps & {
  symbol?: string;
  icon?: string;
  labelClassName?: string;
  editing?: boolean;
  symbolStartsShowing?: boolean;
};

export const TokenInput = (props: TokenInputProps) => {
  const [value, setValue] = useState(
    trimAsNumber(
      props.value as number,
      calculateTrimDigits(props.value as number)
    ).toString()
  );
  const [showTokenSymbol, setShowTokenSymbol] = useState(
    props.symbolStartsShowing
  );

  useEffect(() => {
    setValue(
      trimAsNumber(
        props.value as number,
        calculateTrimDigits(props.value as number)
      ).toString()
    );
  }, [props.value]);

  useEffect(() => {
    setValue(trim(value, calculateTrimDigits(Number(value))).toString());
  }, [value]);

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

    const updated = trimAsNumber(
      e.target.value,
      calculateTrimDigits(e.target.value)
    );

    if (!isNaN(updated)) {
      // @ts-ignore
      props.onChange && props.onChange(updated);
      // @ts-ignore
      setValue(updated);
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
