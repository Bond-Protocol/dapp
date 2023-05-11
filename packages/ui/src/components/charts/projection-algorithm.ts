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
  initialPrice?: number;
  minPrice?: number;
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
  const { initialCapacity, initialPrice, depositInterval, targetDiscount, minPrice, durationInDays } = config;

  if (!minPrice || !initialCapacity || !durationInDays || !depositInterval || !initialPrice) return [];

  const startPrice = initialPrice * (prices[0]?.quotePriceUsd);
  const usdMinPrice = minPrice * prices[0]?.quotePriceUsd;

  const duration = durationInDays * 24;

  const depositIntervalHours = depositInterval / 60 / 60;
  const hourlyDiscount = 20 / depositIntervalHours;

  let price = startPrice;
  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const usdMarketPrice = prices[i]?.payoutPriceUsd;

    if (!date || !usdMarketPrice || !minPrice) {
      return discountedPrices;
    }

    let discount = trimAsNumber(getDiscountPercentage(prices[i].payoutPriceUsd, price), 2);

    discountedPrices.push({
      date: date,
      price: usdMarketPrice,
      discountedPrice: price,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (price <= (prices[i].payoutPriceUsd / 100) * (100 - targetDiscount)) {
      let offset = (prices[0]?.payoutPriceUsd / 100) * 20;
      price = prices[0]?.payoutPriceUsd + offset;
    } else {
      price = (price / 100) * (100 - hourlyDiscount);
    }

    if (price < usdMinPrice) price = usdMinPrice;
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

  if (!initialCapacity || !durationInDays || !maxDiscountFromCurrent || !depositInterval || !baseDiscount || !targetIntervalDiscount) return [];

  const initialPrice = prices[0].price * prices[0]?.quotePriceUsd;
  const minPrice = ((prices[0].price * prices[0]?.quotePriceUsd) / 100) * (100 - maxDiscountFromCurrent);

  const duration = durationInDays * 24;

  const depositIntervalHours = depositInterval / 60 / 60;
  const hourlyDiscount = (baseDiscount + targetIntervalDiscount) / depositIntervalHours;
  let currentDiscount = baseDiscount;

  let discountedPrice = (initialPrice / 100) * (100 - currentDiscount);

  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const usdMarketPrice = prices[i]?.payoutPriceUsd;

    if (!date || !usdMarketPrice) {
      return discountedPrices;
    }

    const discount = trimAsNumber(getDiscountPercentage(prices[i].payoutPriceUsd, discountedPrice), 2);

    discountedPrices.push({
      date: date,
      price: usdMarketPrice,
      discountedPrice: discountedPrice,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (discountedPrice <= (prices[i].payoutPriceUsd / 100) * (100 - targetDiscount)) {
      discountedPrice = prices[0]?.payoutPriceUsd;
      currentDiscount = 0;
    }

    discountedPrice = (prices[i]?.payoutPriceUsd / 100) * (100 - currentDiscount);
    if (discountedPrice < minPrice) discountedPrice = minPrice;
    currentDiscount += hourlyDiscount;
  }

  return discountedPrices;
}

export const generateFixedDiscountPrice = (
  prices: PriceData[],
  { fixedPrice }: ProjectionConfiguration
): DiscountedPriceData[] => {
  if (!fixedPrice) return [];

  return prices.map((p) => ({
    ...p,
    price: p.payoutPriceUsd,
    discountedPrice: fixedPrice * p.quotePriceUsd,
    discount: getDiscountPercentage(p.price, fixedPrice || 0),
  }));
};

export const generateOracleFixedDiscountPrice = (
  prices: PriceData[],
  { fixedDiscount, maxDiscountFromCurrent }: ProjectionConfiguration
): DiscountedPriceData[] => {
  if (!fixedDiscount || !maxDiscountFromCurrent) return [];

  return prices.map((p) => {
    let discountedPrice = (p.payoutPriceUsd / 100) * (100 - fixedDiscount);
    const minPrice = (prices[0].payoutPriceUsd / 100) * (100 - maxDiscountFromCurrent);
    discountedPrice = Math.max(discountedPrice, minPrice);

    return ({
      ...p,
      price: p.payoutPriceUsd,
      discountedPrice: discountedPrice,
      discount: trimAsNumber(getDiscountPercentage(p.payoutPriceUsd, discountedPrice), 2),
    })
  });
};
