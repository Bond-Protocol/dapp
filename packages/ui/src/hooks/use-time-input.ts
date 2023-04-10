import { useState } from "react";

// Partially matches time in 24h HH:MM format
const partialMatch =
  /^(?:(?:[0-1]?[0-9])|(?:2[0-3]?))(?::(?:[0-5]|[0-5][0-9])?)?$/;
//Same thing but full matches only
const fullMatch = /([01]\d|2[0-3]):([0-5]\d)/;

export const useTimeInput = (
  defaultValue = ""
): {
  time: string;
  setTime: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  matcher: RegExp;
} => {
  const [time, setTime] = useState(defaultValue);

  const validateAndSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    let nextValue = event.target.value;

    if (
      // We add the : separator after a user types the second or 3rd digit
      (nextValue.length === 2 || nextValue.length === 3) &&
      !time.includes(":")
    ) {
      let [a, b, c] = nextValue.split("");
      nextValue = [a, b, ":", c].join("");
    }

    const isValid = partialMatch.test(nextValue) || nextValue === "";

    if (!isValid) return;

    //If the typed number is above 2, we're adding an hour between 00-09, so we add a 0 before
    if (nextValue.length === 1 && Number(nextValue) > 2) {
      nextValue = 0 + nextValue;
    }

    setTime(nextValue);
  };

  return { time, setTime: validateAndSet, matcher: fullMatch };
};
