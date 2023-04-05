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
  initialPrice?: number;
  minPrice?: number;
  fixedPrice?: number;
  maxPremium: number;
  maxDiscount: number;
  triggerCount: number;
}

export function generateDiscountedPrices(
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] {
  let discountedPrices: DiscountedPriceData[] = [];
  let currentTriggerCount = 0;
  const { maxDiscount, maxPremium, triggerCount } = config;

  // Calculate the index step for triggers
  const step = Math.floor(prices.length / (triggerCount + 1));

  for (let i = 0; i < prices.length; i++) {
    let priceObj = prices[i];
    let discountedPrice: number;
    let discount: number;

    if (i === 0) {
      discountedPrice = priceObj.price;
      discount = 0;
    } else {
      if (i % step === 0 && currentTriggerCount < triggerCount) {
        discountedPrice = priceObj.price * (1 + maxPremium / 100);
        currentTriggerCount++;
      } else {
        const prevTriggerIndex = i - (i % step);
        const prevTriggerPrice = prices[prevTriggerIndex].price;
        const slope =
          (prevTriggerPrice * (1 - maxDiscount / 100) -
            prevTriggerPrice * (1 + maxPremium / 100)) /
          step;
        discountedPrice =
          prevTriggerPrice * (1 + maxPremium / 100) + slope * (i % step);
      }

      // Ensure discountedPrice is within the specified range
      discountedPrice = Math.min(
        discountedPrice,
        priceObj.price * (1 + maxPremium / 100)
      );
      discountedPrice = Math.max(
        discountedPrice,
        priceObj.price * (1 - maxDiscount / 100)
      );

      discount = ((priceObj.price - discountedPrice) / priceObj.price) * 100;
    }

    discountedPrices.push({
      date: priceObj.date,
      price: priceObj.price,
      discountedPrice: discountedPrice,
      discount: discount,
    });
  }

  return discountedPrices;
}

export const generateFixedDiscountPrice = (
  prices: PriceData[],
  config: ProjectionConfiguration
): DiscountedPriceData[] => {
  return prices.map((p) => ({
    ...p,
    discountedPrice: config.fixedPrice || 0,
    discount: getDiscountPercentage(p.price, config.fixedPrice || 0),
  }));
};
