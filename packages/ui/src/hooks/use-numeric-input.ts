import { useState } from "react";

export const useNumericInput = (initialValue = "0", isPercentual?: boolean) => {
  const [value, setValue] = useState<string>(
    isPercentual ? `${initialValue}%` : initialValue
  );

  const onChange = (event: React.BaseSyntheticEvent) => {
    const nextValue = event.target.value;

    if (isNaN(nextValue)) {
      return value;
    }

    setValue(nextValue);
    return nextValue;
  };

  const getAValidPercentage = (v: string) => {
    let num = parseFloat(v);
    return (num > 100 ? 100 : num < 0 ? 0 : num).toString();
  };

  const onFocus = () => {
    if (isPercentual) {
      setValue((prev) => parseFloat(prev).toString());
    }
  };

  const onBlur = () => {
    if (isPercentual) {
      setValue((prev) => getAValidPercentage(prev) + "%");
    }
  };

  return {
    value,
    onChange,
    onFocus,
    onBlur,
    setValue,
  };
};
