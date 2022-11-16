/**
 * Converts a date object to UNIX timestamp
 */
export const getTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};
