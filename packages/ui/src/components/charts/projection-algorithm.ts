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
  const discountPercentage = (discount / price) * 100;
  return discountPercentage;
};

export interface ProjectionConfiguration {
  initialCapacity?: number;
  targetDiscount?: number;
  initialPrice?: number;
  minPrice?: number;
  maxBondSize?: number;
  durationInDays?: number;
  fixedPrice?: number;
  maxPremium?: number;
  maxDiscount?: number;
  triggerCount?: number;
}

export function generateDiscountedPrices(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  if (!prices || prices.length === 0) return [];

  let discountedPrices: DiscountedPriceData[] = [];
  let { initialCapacity, targetDiscount, initialPrice, minPrice, maxBondSize, durationInDays } = config;

  if (!initialCapacity || !durationInDays) return [];

  initialPrice = prices[0].price;

  let offset = 0;
  let duration = durationInDays * 24;

  let price = initialPrice;
  for (let i = 0; i < duration; i++) {
    let date = prices[i].date;
    let usdBondPrice = price * (prices[i].quotePriceUsd);
    let usdMarketPrice = prices[i].payoutPriceUsd;
    let discount = (usdBondPrice - usdMarketPrice) / usdMarketPrice;
    discount *= 100;
    discount = trimAsNumber(-discount, 2);

    discountedPrices.push({
      date: date,
      price: usdMarketPrice,
      discountedPrice: usdBondPrice,
      discount: discount,
      quotePriceUsd: prices[i].quotePriceUsd,
      payoutPriceUsd: prices[i].payoutPriceUsd
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

export const generatedDiscountedPricesSimple = (
  prices: PriceData[],
  { minPrice, initialPrice }: ProjectionConfiguration
) => {
  return prices.map((p) => ({ ...p, initialPrice, minPrice }));
};
