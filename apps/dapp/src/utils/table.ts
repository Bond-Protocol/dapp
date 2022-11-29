import { Column, Cell } from "ui";

export const toValue = (v: any) => ({ value: v });

export const toTableData = (
  columns: Column<any>[],
  data: any
): Record<string, Cell> => {
  return columns.reduce((acc, { accessor, formatter }) => {
    //@ts-ignore
    const value = String(data[accessor]);
    return {
      ...acc,
      [accessor]: formatter ? formatter(data) : toValue(value),
    };
  }, {});
};
