import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import fnsAddMonths from "date-fns/addMonths";
import fnsIsBefore from "date-fns/isBefore";

const handleError = (error: Error) => {
  console.error(error);
  return "invalid";
};

const withErrorHandling = (fn: Function) => {
  return (...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      return handleError(error as any);
    }
  };
};

export const short = withErrorHandling((date: Date) => {
  return format(date, "yyyy.MM.dd");
});

export const dayMonthTime = withErrorHandling((date: Date) => {
  return format(date, "MM/dd p");
});

export const distanceToNow = withErrorHandling((date: Date) => {
  return formatDistanceToNow(date);
});

export const longDate = withErrorHandling((date: Date) => {
  return format(date, "PP pp");
});

export const addMonths = withErrorHandling((date: Date, months: number) => {
  return fnsAddMonths(date, months);
});

export const isBefore = withErrorHandling((date: Date, target: Date) => {
  return fnsIsBefore(date, target);
});

export const addTimeToDate = (date = new Date(), time = "00:00") => {
  // Extract the day, month, and year from the date
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  // Get the time as a string in the format "HH:MM"
  const [hours, minutes] = time.split(":");

  // Create a new Date object with the current date and the specified time
  return new Date(year, month, day, Number(hours), Number(minutes));
};

export const formatDate = {
  short,
  longDate,
  dayMonthTime,
  distanceToNow,
};

export const dateMath = {
  addMonths,
  isBefore,
  addTimeToDate,
};
