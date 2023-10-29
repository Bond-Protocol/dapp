
export const trimAsNumber = (num: number, precision: number): number => {
  return Number(trim(num, precision));
};

export const trim = (num: number | string, precision: number): string => {
  if (num == undefined) {
    num = 0;
  }

  if (num.toString().indexOf("e") !== -1) {
    const index = num.toString().indexOf("e") + 2;
    const exp = Number(num.toString().substring(index));
    return Number(num)
      .toFixed(exp + precision)
      .toString();
  }
  const array = num.toString().split(".");
  if (array.length === 1) return num.toString();

  const r = array.pop();

  if (!r) throw new Error("Something went wrong trimming a number");

  if (precision > 0) {
    array.push(r.substring(0, precision));
    return array.join(".");
  }
  return array.toString();
};

export const calculateTrimDigits = (num: number): number => {
  if (num >= 1000) return 0;
  if (num >= 0.1) return 2;
  else {
    let str = num.toString();
    let str2 = str.replace(/\.(0+)?/, "");
    return str.length - str2.length + 2;
  }
};
