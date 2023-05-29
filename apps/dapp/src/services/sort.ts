export const numericSort = function (
  value1: number,
  value2: number,
  ascending: boolean
) {
  return ascending ? value1 - value2 : value2 - value1;
};

export const alphabeticSort = function (
  value1: string,
  value2: string,
  ascending: boolean
) {
  return ascending ? (value1 > value2 ? 1 : -1) : value2 > value1 ? 1 : -1;
};
