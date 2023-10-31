import { useState } from "react";

export const useSymbolInput = (
  defaultValue = "",
  symbol = "",
  showSymbol = false
) => {
  const [value, setValue] = useState(defaultValue);
  const [showTokenSymbol, setShowTokenSymbol] = useState(showSymbol);

  const onBlur = (_e: React.BaseSyntheticEvent) => {
    let updated = value === "" ? "0" : value;
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
      setValue(updated);
      return updated;
    }
  };

  return {
    value: showTokenSymbol ? `${value} ${symbol}` : value,
    setValue,
    onChange,
    onFocus,
    onBlur,
  };
};
