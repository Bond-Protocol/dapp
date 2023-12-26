import { useEffect, useState } from "react";

export const useNumericInput = (initialValue = "", isPercentual?: boolean) => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    let updated = value ?? initialValue;
    updated = isPercentual ? `${updated}%` : updated;

    setValue(updated);
  }, [isPercentual]);

  const onChange = (event: React.BaseSyntheticEvent) => {
    const nextValue = event.target.value;

    if (isNaN(nextValue)) {
      setValue("0");
      return "0";
    }

    setValue(nextValue);
    return nextValue;
  };

  const getAValidPercentage = (percentage: string) => {
    let num = parseFloat(percentage);
    let updated = isNaN(num) ? 0 : num;
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
