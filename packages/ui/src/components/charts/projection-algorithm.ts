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
  tokenPrices: boolean;
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

export function generateSDAChartData(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  if (!prices || prices.length === 0) return [];

  const discountedPrices: DiscountedPriceData[] = [];
  const { tokenPrices, initialCapacity, initialPrice, depositInterval, targetDiscount, minPrice, durationInDays } = config;

  if (!minPrice || !initialCapacity || !durationInDays || !depositInterval || !initialPrice) return [];

  const duration = durationInDays * 24;
  if (duration > prices.length) return [];
  const depositIntervalHours = depositInterval / 60 / 60;
  const hourlyDiscount = 20 / depositIntervalHours;

  let discountedPrice = initialPrice;
  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const marketPrice = prices[i]?.price;
    const usdMarketPrice = prices[i]?.payoutPriceUsd;
    const usdDiscountedPrice = discountedPrice * prices[i]?.quotePriceUsd;
    const usdTargetPrice = (prices[i].payoutPriceUsd / 100) * (100 - targetDiscount);

    if (!date || !marketPrice || !usdMarketPrice || !minPrice) {
      return discountedPrices;
    }

    let discount = trimAsNumber(getDiscountPercentage(usdMarketPrice, usdDiscountedPrice), 2);

    discountedPrices.push({
      date: date,
      price: tokenPrices
        ? marketPrice
        : usdMarketPrice,
      discountedPrice: tokenPrices
        ? discountedPrice
        : usdDiscountedPrice,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (usdDiscountedPrice <= usdTargetPrice) {
      let offset = (prices[0]?.price / 100) * 20;
      discountedPrice = prices[0]?.price + offset;
    } else {
      discountedPrice = (discountedPrice / 100) * (100 - hourlyDiscount);
    }

    if (discountedPrice < minPrice) discountedPrice = minPrice;
  }

  return discountedPrices;
}

export function generateOSDAChartData(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  if (!prices || prices.length === 0) {
    return [];
  }
  const discountedPrices: DiscountedPriceData[] = [];
  const { tokenPrices, targetDiscount, initialCapacity, baseDiscount, targetIntervalDiscount, maxDiscountFromCurrent, durationInDays, depositInterval } = config;

  if (!initialCapacity || !durationInDays || !depositInterval || maxDiscountFromCurrent === undefined || targetIntervalDiscount === undefined || baseDiscount === undefined) return [];

  const initialPrice = prices[0].price;
  const minPrice = (prices[0].price / 100) * (100 - maxDiscountFromCurrent);

  const duration = durationInDays * 24;
  if (duration > prices.length) return [];
  const depositIntervalHours = depositInterval / 60 / 60;
  const hourlyDiscount = targetIntervalDiscount / depositIntervalHours;

  let currentDiscount = 0;
  let actualDiscount = (1 - (1 - (baseDiscount / 100)) * (1 - (currentDiscount / 100))) * 100;
  let discountedPrice = (initialPrice / 100) * (100 - actualDiscount);

  for (let i = 0; i < duration; i++) {
    const date = prices[i]?.date;
    const tokenMarketPrice = prices[i]?.price;

    const usdMarketPrice = prices[i]?.payoutPriceUsd;
    const usdDiscountedPrice = discountedPrice * prices[i]?.quotePriceUsd;
    const usdTargetPrice = (prices[i].payoutPriceUsd / 100) * (100 - targetDiscount);

    if (!date || !tokenMarketPrice) {
      return discountedPrices;
    }

    const discount = trimAsNumber(getDiscountPercentage(usdMarketPrice, usdDiscountedPrice), 2);

    discountedPrices.push({
      date: date,
      price: tokenPrices
        ? tokenMarketPrice
        : usdMarketPrice,
      discountedPrice: tokenPrices
        ? discountedPrice
        : usdDiscountedPrice,
      discount: discount,
      quotePriceUsd: prices[i]?.quotePriceUsd,
      payoutPriceUsd: prices[i]?.payoutPriceUsd
    });

    if (usdDiscountedPrice <= usdTargetPrice) {
      currentDiscount = 0;
    } else {
      currentDiscount += hourlyDiscount;
    }
    actualDiscount = (1 - (1 - (baseDiscount / 100)) * (1 - (currentDiscount / 100))) * 100;
    discountedPrice = (prices[i]?.price / 100) * (100 - actualDiscount);
    if (discountedPrice < minPrice) discountedPrice = minPrice;
  }

  return discountedPrices;
}

export const generateFPAChartData = (
  prices: PriceData[],
  { tokenPrices, fixedPrice }: ProjectionConfiguration
): DiscountedPriceData[] => {
  if (!fixedPrice) return [];

  return prices.map((p) => {
    const price = tokenPrices
      ? p.price
      : p.payoutPriceUsd;

    const discountedPrice = tokenPrices
      ? fixedPrice
      : fixedPrice * p.quotePriceUsd;

    return ({
      ...p,
      price: price,
      discountedPrice: discountedPrice,
      discount: getDiscountPercentage(price, discountedPrice),
    });
  });
};

export const generateOFDAChartData = (
  prices: PriceData[],
  { tokenPrices, fixedDiscount, maxDiscountFromCurrent }: ProjectionConfiguration
): DiscountedPriceData[] => {
  if (!fixedDiscount || !maxDiscountFromCurrent) return [];

  return prices.map((p) => {
    let discountedPrice = tokenPrices
      ? (p.price / 100) * (100 - fixedDiscount)
      : (p.payoutPriceUsd / 100) * (100 - fixedDiscount);

    const minPrice = tokenPrices
      ? ((prices[0].payoutPriceUsd / prices[0].quotePriceUsd) / 100) * (100 - maxDiscountFromCurrent)
      : (prices[0].payoutPriceUsd / 100) * (100 - maxDiscountFromCurrent);

    discountedPrice = Math.max(discountedPrice, minPrice);

    const price = tokenPrices
      ? p.price
      : p.payoutPriceUsd;

    return ({
      ...p,
      price: price,
      discountedPrice: discountedPrice,
      discount: trimAsNumber(getDiscountPercentage(price, discountedPrice), 2),
    });
  });
};
