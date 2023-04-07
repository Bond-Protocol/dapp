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
    }).format(parseFloat(num));
  }

  return new Intl.NumberFormat("en-us", {
    maximumFractionDigits,
  }).format(parseFloat(num));
};

export const formatCurrency = {
  dynamicFormatter,
  longFormatter,
  usdFormatter,
  usdLongFormatter,
};
