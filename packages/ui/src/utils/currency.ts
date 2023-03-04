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

export const dynamicFormatter = (value: string | number) => {
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

  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "usd",
    maximumFractionDigits,
  }).format(parseFloat(num));
};

export const formatCurrency = {
  dynamicFormatter,
  longFormatter,
  usdFormatter,
  usdLongFormatter,
};
