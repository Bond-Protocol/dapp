import { Column, Cell } from "ui";

export const toValue = (value: any) => ({ value });

export const toTableData = (
  columns: Column<any>[],
  data: any
): Record<string, Cell> => {
  return columns.reduce((acc, { accessor, formatter }) => {
    const value = String(data[accessor]);
    return {
      ...acc,
      [accessor]: formatter ? formatter(data) : toValue(value),
    };
  }, {});
};
