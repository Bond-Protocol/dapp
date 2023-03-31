import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import fnsAddMonths from "date-fns/addMonths";
import fnsIsBefore from "date-fns/isBefore";
import fnsAddDays from "date-fns/addDays";
import { wrapWithErrorHandler } from "./error-handler";

export const short = (date: Date) => {
  return format(date, "yyyy.MM.dd");
};

export const dayMonthTime = (date: Date) => {
  return format(date, "MM/dd p");
};

export const distanceToNow = (date: Date) => {
  return formatDistanceToNow(date);
};

export const longDate = (date: Date) => {
  return format(date, "PP pp");
};

export const addMonths = (date: Date, months: number) => {
  return fnsAddMonths(date, months);
};

export const isBefore = (date: Date, target: Date) => {
  return fnsIsBefore(date, target);
};

/**
 * Adds a time string in hh:mm format to a date object
 */
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

export const addDays = (date: Date, days: number) => {
  return fnsAddDays(date, days);
};

export const formatDate = wrapWithErrorHandler({
  short,
  longDate,
  dayMonthTime,
  distanceToNow,
});

export const dateMath = wrapWithErrorHandler({
  isBefore,
  addDays,
  addMonths,
  addTimeToDate,
});
