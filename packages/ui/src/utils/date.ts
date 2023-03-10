import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";

function errorWrapper(f: Function) {
  return function () {
    try {
      //@ts-ignore
      f.apply(this, arguments);
    } catch (e) {
      return "Invalid date";
    }
  };
}

export const shortDate = (date: Date) => {
  try {
    return format(date, "yyyy.MM.dd");
  } catch (error) {
    console.error(error);
    return "Invalid";
  }
};

export const dayMonthTime = (date: Date) => {
  try {
    return format(date, "MM/dd p");
  } catch (error) {
    console.error(error);
    return "Invalid";
  }
};

export const distanceToNow = (date: Date) => {
  try {
    return formatDistanceToNow(date);
  } catch (error) {
    console.error(error);
    return "Invalid";
  }
};

export const longDate = (date: Date) => {
  try {
    return format(date, "PP pp");
  } catch (error) {
    console.error(error);
    return "invalid";
  }
};

export const formatDate = {
  short: shortDate,
  longDate,
  dayMonthTime,
  distanceToNow,
};
