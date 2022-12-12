import { format, formatDistanceToNow } from "date-fns";

export const short = (date: Date) => {
  try {
    return format(date, "yyyy.MM.dd");
  } catch (error) {
    console.error(error);
    return "Invalid";
  }
};

export const chartAxis = (date: Date) => {
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

export const formatDate = {
  short,
  chartAxis,
  distanceToNow,
};
