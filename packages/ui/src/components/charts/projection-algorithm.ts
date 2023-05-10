import {trimAsNumber} from "utils";

export interface PriceData {
  date: number;
  price: number;
  quotePriceUsd: number;
  payoutPriceUsd: number;
}

export interface DiscountedPriceData extends PriceData {
  discountedPrice: number;
  discount: number;
}

export const findEdges = (data: DiscountedPriceData[]) => {
  return data.reduce(
    (acc, ele) => {
      return {
        min: Math.min(acc.min, ele.price, ele.discountedPrice),
        max: Math.max(acc.max, ele.price, ele.discountedPrice),
      };
    },
    { max: 0, min: 10000000 }
  );
};

export const getDiscountPercentage = (
  price: number,
  discountedPrice: number
) => {
  const discount = price - discountedPrice;
  return (discount / price) * 100;
};

export interface ProjectionConfiguration {
  targetDiscount: number;
  minPrice: number;
  initialCapacity?: number;
  durationInDays?: number;
  fixedPrice?: number;
  fixedDiscount?: number;
  baseDiscount?: number;
  targetIntervalDiscount?: number;
  maxDiscountFromCurrent?: number;
  depositInterval?: number;
}

export function generateDiscountedPrices(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  if (!prices || prices.length === 0) return [];

  const discountedPrices: DiscountedPriceData[] = [];
  const { initialCapacity, targetDiscount, minPrice, durationInDays } = config;

  if (!initialCapacity || !durationInDays) return [];

  const initialPrice = prices[0].price;

  let offset = 0;
  const duration = durationInDays * 24;

  let price = initialPrice;
  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const usdBondPrice = price * (prices[i]?.quotePriceUsd);
    const usdMarketPrice = prices[i]?.payoutPriceUsd;

    if (!date || !usdBondPrice || !usdMarketPrice) {
      return discountedPrices;
    }

    let discount = (usdBondPrice - usdMarketPrice) / usdMarketPrice;
    discount *= 100;
    discount = trimAsNumber(-discount, 2);

    discountedPrices.push({
      date: date,
      price: usdMarketPrice,
      discountedPrice: usdBondPrice,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (usdBondPrice <= (usdMarketPrice / 100) * (100 - targetDiscount)) {
      offset = (price / 100) * 20;
      price = initialPrice + offset;
    }

    price *= 0.9905;
    if (price < minPrice) price = minPrice;
  }

  return discountedPrices;
}

export function generateOracleDiscountedPrices(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  if (!prices || prices.length === 0) {
    return [];
  }
  const discountedPrices: DiscountedPriceData[] = [];
  const { targetDiscount, initialCapacity, baseDiscount, targetIntervalDiscount, maxDiscountFromCurrent, durationInDays, depositInterval } = config;
console.log({ targetDiscount, initialCapacity, baseDiscount, targetIntervalDiscount, maxDiscountFromCurrent, durationInDays, depositInterval })
  if (!initialCapacity || !durationInDays || !maxDiscountFromCurrent || !depositInterval || !baseDiscount || !targetIntervalDiscount) return [];

  const initialPrice = prices[0].price;
  const minPrice = (prices[0].price / 100) * (100 - maxDiscountFromCurrent);

  const duration = durationInDays * 24;

  const depositIntervalHours = depositInterval / 60 / 60;
  const hourlyDiscount = (baseDiscount + targetIntervalDiscount) / depositIntervalHours;
  let currentDiscount = baseDiscount;

  let price = (initialPrice / 100) * (100 - currentDiscount);

  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const usdMarketPrice = prices[i]?.payoutPriceUsd;

    if (!date || !usdMarketPrice) {
      return discountedPrices;
    }

    let discount = trimAsNumber(currentDiscount, 2);

    discountedPrices.push({
      date: date,
      price: usdMarketPrice,
      discountedPrice: price,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (currentDiscount >= targetDiscount) {
      price = prices[0]?.payoutPriceUsd;
      currentDiscount = 0;
    }

    price = (prices[i]?.payoutPriceUsd / 100) * (100 - currentDiscount);
    if (price < minPrice) price = minPrice;
    currentDiscount += hourlyDiscount;
  }
console.log(discountedPrices)
  return discountedPrices;
}

export const generateFixedDiscountPrice = (
  prices: PriceData[],
  { fixedPrice }: ProjectionConfiguration
): DiscountedPriceData[] => {
  return prices.map((p) => ({
    ...p,
    discountedPrice: fixedPrice || 0,
    discount: getDiscountPercentage(p.price, fixedPrice || 0),
  }));
};

export const generateOracleFixedDiscountPrice = (
  prices: PriceData[],
  { fixedDiscount, maxDiscountFromCurrent }: ProjectionConfiguration
): DiscountedPriceData[] => {
  return prices.map((p) => {
    let discountedPrice = (p.payoutPriceUsd / 100) * (100 - fixedDiscount);
    const minPrice = (prices[0].payoutPriceUsd / 100) * (100 - maxDiscountFromCurrent);
    discountedPrice = Math.max(discountedPrice, minPrice);

    return ({
      ...p,
      discountedPrice: discountedPrice,
      discount: getDiscountPercentage(p.price, discountedPrice || 0),
    })
  });
};
