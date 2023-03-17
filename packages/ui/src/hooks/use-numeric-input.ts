import { useState } from "react";

export const useNumericInput = (initialValue = "0", isPercentual?: boolean) => {
  const [value, setInternalValue] = useState<string>(
    isPercentual ? `${initialValue}%` : initialValue
  );

  const handleDecimalValues = (num: string) => {
    if (num.includes(".")) {
      let expression = /\./;
      const [whole, decimal] = num.split(expression);

      console.log({ whole, decimal });
      if (isNaN(Number(whole)) || isNaN(Number(decimal))) {
        console.log("is-nan");
        return value;
      }
    }

    return num;
  };

  const onChange = (event: React.BaseSyntheticEvent) => {
    const nextValue = event.target.value;

    const isnan = isNaN(nextValue);
    console.log({ isnan });
    if (isnan) return;

    setValue(() => nextValue);
  };

  const onSelect = () => {
    if (isPercentual) {
      setInternalValue(parseFloat(value).toString());
    }
  };

  const getAValidPercentage = (num) => {
    if (num === "0.") return num;
    return (num > 100 ? 100 : num < 0 ? 0 : num).toString();
  };

  const onBlur = () => {
    if (isPercentual) {
      let num = value;
      let updatedRate = getAValidPercentage(num);
      setInternalValue(updatedRate + "%");
    }
  };

  const setValue = (handler: string | ((value: string) => any)) => {
    setInternalValue((prev) => {
      let updatedValue = prev;

      console.log("##1", updatedValue);
      if (isPercentual) {
        updatedValue = value.replace("%", "");
        console.log("##1.1", updatedValue);
      }

      updatedValue =
        typeof handler === "function" ? handler(updatedValue) : handler;
      console.log("##2", updatedValue);

      updatedValue = handleDecimalValues(updatedValue);
      console.log("##3", updatedValue);

      if (isPercentual) {
        console.log("##3.1", updatedValue);
        let num = updatedValue;
        const valid = getAValidPercentage(num);
        console.log({ num, valid });
        return valid;
      }

      return updatedValue;
    });
  };

  return {
    value,
    onChange,
    onSelect,
    onBlur,
    setValue,
  };
};
