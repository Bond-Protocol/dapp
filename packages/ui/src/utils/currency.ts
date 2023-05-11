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

export const longerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 8,
});

export const getRateMod = (value: string | number) => {
  let rateMod;

  if (value > 0.1 && value <= 1) {
    rateMod = 0.01;
  } else if (value > 1 && value < 100) {
    rateMod = 0.1
  } else if (value >= 100) {
    rateMod = Math.pow(10, Math.floor(Number(value) / 100).toString().length - 1);
  } else {
    const numZeroes = 1 - Math.floor(Math.log(Number(value)) / Math.log(10)) - 1;

    rateMod = "0.";
    for (let i = 0; i < numZeroes; i++) {
      rateMod = rateMod.concat("0");
    }
    rateMod = Number(rateMod.concat("1"));
  }

  return rateMod;
}

export const getPriceScale = (value: string | number) => {
  let scale;

  if (value >= 1000) {
    scale = 0;
  } else if (value >= 100) {
    scale = 2;
  } else if (value >= 1) {
    scale = 2;
  } else {
    let str = value.toString();
    let str2 = str.replace(/\.(0+)?/, '');
    scale = str.length - str2.length + 1;
  }

  return scale;
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
