import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import fnsAddMonths from "date-fns/addMonths";
import fnsIsBefore from "date-fns/isBefore";
import fnsAddDays from "date-fns/addDays";
import intervalToDuration from "date-fns/intervalToDuration";
import { wrapWithErrorHandler } from "./error-wrapper";

export { intervalToDuration };

// Math
export const addDays = (date: Date, days: number) => fnsAddDays(date, days);
export const addMonths = (date: Date, months: number) =>
  fnsAddMonths(date, months);

/**
 * Checks whether a date is before another
 */
export const isBefore = (date: Date, target: Date) => fnsIsBefore(date, target);
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

// Format
export const shorter = (date: Date) => format(date, "yy.MM.dd");
export const short = (date: Date) => format(date, "yyyy.MM.dd");
export const long = (date: Date) => format(date, "PP pp");
export const dayMonthTime = (date: Date) => format(date, "MM/dd p");
export const dateAndTime = (date: Date) => format(date, "yyyy.MM.dd - HH:mm z");
export const distanceToNow = (date: Date) => formatDistanceToNow(date);

const distanceFormat = {
  years: "{{count}}Y",
  days: "{{count}}D",
  months: "{{count}}M",
  weeks: "{{count}}W",
  hours: "{{count}}H",
  minutes: "{{count}}M",
  seconds: "{{count}}S",
};

export const interval = (start: Date, end: Date) => {
  const duration: Record<string, number> = intervalToDuration({ start, end });

  //return formatDuration(duration, { format: ["Y", "M", "W", "D", "H", "M", "S"], locale: { code: "en_US" }, });
  return Object.keys(duration)
    .map((unit, i, arr) => {
      if (duration[unit] === 0) {
        if (i === 0 || duration[arr[i - 1]] === 0) return null;
      }
      //@ts-ignore
      return distanceFormat[unit].replace("{{count}}", duration[unit]);
    })
    .filter(Boolean)
    .join(" ");
};

export const dateMath = wrapWithErrorHandler({
  isBefore,
  addDays,
  addMonths,
  addTimeToDate,
});

export const formatDate = wrapWithErrorHandler({
  shorter,
  short,
  long,
  dateAndTime,
  dayMonthTime,
  distanceToNow,
  interval,
});
