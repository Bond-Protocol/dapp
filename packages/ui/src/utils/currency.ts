export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const usdLongFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  maximumFractionDigits: 0,
});

export const longFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const getPriceScale = (value: string | number) => {
  let num = String(value);

  let rateMod = 0.001;
  let scale = 2;
  let [single, decimal] = num.split(".").map((n) => parseFloat(n));

  if (decimal > 1000) {
    rateMod = 0.001;
    scale = 6;
  }

  if (decimal > 100) {
    rateMod = 0.01;
    scale = 5;
  }

  if (single > 0) {
    rateMod = 0.1;
  }

  if (single > 100) {
    rateMod = 1;
  }

  return { rateMod, scale };
};

export const dynamicFormatter = (value: string | number, currency = true) => {
  let num = String(value);

  if (!num?.split) return num;
  let maximumFractionDigits = 0;
  let [single, decimal] = num.split(".").map((n) => parseFloat(n));

  if (decimal > 1000) {
    maximumFractionDigits = 6;
  }

  if (decimal > 100) {
    maximumFractionDigits = 5;
  }

  if (single > 0) {
    maximumFractionDigits = 2;
  }

  if (single > 1000) {
    maximumFractionDigits = 0;
  }

  if (currency) {
    return new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "usd",
      maximumFractionDigits,
    }).format(Number(num));
  }

  return new Intl.NumberFormat("en-us", {
    maximumFractionDigits,
  }).format(Number(num));
};

export const trimToLengthSymbol = (num: number) => {
  if (num < 1) return num;
  const symbols = ["", "K", "M", "B", "T", "Q", "GMI"]; // array of symbols to use for each magnitude of number
  const sign = Math.sign(num); // determine if the number is negative or positive
  num = Math.abs(num); // get the absolute value of the number
  //const mag = Math.floor(Math.log10(num) / 3); // calculate the magnitude of the number in units of 3
  const mag = Math.min(Math.floor(Math.log10(num) / 3), symbols.length - 1); // use Math.min to handle numbers greater than quadrillions
  const shortNum = Number((num / Math.pow(10, mag * 3)).toFixed(1)) * sign; // truncate the number to 1 decimal place and multiply by the sign
  return `${shortNum}${symbols[mag]}`;
};

export const formatCurrency = {
  dynamicFormatter,
  longFormatter,
  usdFormatter,
  usdLongFormatter,
  trimToLengthSymbol,
};
