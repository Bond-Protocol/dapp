import {trimAsNumber} from "utils";

export interface PriceData {
  date: number;
  price: number;
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
  let discountedPrices: DiscountedPriceData[] = [];
  let { initialCapacity, targetDiscount, initialPrice, minPrice, maxBondSize, durationInDays } = config;

  let capacity = initialCapacity;
  let expectedCapacity = initialCapacity;
  let decayInterval = 5 * 6;
  let duration = durationInDays * 6;
  let decaySpeed = duration / decayInterval;

  let outputPrices = [{ initialPrice, details: {} }];
  let offset = 0;

  let tokenPrices = [prices[0]];
  for (let i = 1; i < duration; i++) {
    tokenPrices.push(prices[(i * 4) - 1])
    // Update expected capacity
    expectedCapacity = capacity * (duration - i) / duration;

    // Decay price
    let price = (initialPrice * (1 + decaySpeed * (expectedCapacity - capacity) / initialCapacity)) + offset;

    let usdBondPrice = price * (prices[(i * 4) - 1].quotePriceUsd);
    let usdMarketPrice = prices[(i * 4) - 1].payoutPriceUsd;
    let discount = (usdBondPrice - usdMarketPrice) / usdMarketPrice;
    discount *= 100;
    discount = trimAsNumber(-discount, 2);

    if (price < minPrice) price = minPrice;
    outputPrices.push({
      price,
      usdBondPrice,
      usdMarketPrice,
      discount,
    details: {
      initialPrice,
        decaySpeed,
        expectedCapacity,
        capacity,
        initialCapacity,
        offset
    }
  });

    if (price <= (initialPrice / 100) * (100 - targetDiscount)) {
      capacity -= maxBondSize;
      offset = offset + (initialPrice - price);
    }
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
