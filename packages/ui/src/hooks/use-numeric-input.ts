import { useEffect, useState } from "react";

export const useNumericInput = (initialValue = "0", isPercentual?: boolean) => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    let updated = value ?? initialValue;
    updated = isPercentual ? `${updated}%` : parseFloat(updated).toString();

    setValue(updated);
  }, [isPercentual]);

  const onChange = (event: React.BaseSyntheticEvent) => {
    const nextValue = event.target.value;

    if (isNaN(nextValue)) {
      return "0";
    }

    setValue(nextValue);
    return nextValue;
  };

  const getAValidPercentage = (v: string) => {
    let num = parseFloat(v);
    let updated = isNaN(num) ? 0 : v;
    let result = (updated > 100 ? 100 : updated < 0 ? 0 : updated).toString();
    return result;
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
    getAValidPercentage,
  };
};
