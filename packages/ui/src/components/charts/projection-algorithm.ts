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

export function generateDiscountedPrices(
  prices: PriceData[],
  maxDiscountPercentage: number,
  triggerCount: number,
  minDiscountPercentage: number
): DiscountedPriceData[] {
  let discountedPrices: DiscountedPriceData[] = [];
  let currentTriggerCount = 0;

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
        discountedPrice = priceObj.price * (1 + minDiscountPercentage / 100);
        currentTriggerCount++;
      } else {
        const prevTriggerIndex = i - (i % step);
        const prevTriggerPrice = prices[prevTriggerIndex].price;
        const slope =
          (prevTriggerPrice * (1 - maxDiscountPercentage / 100) -
            prevTriggerPrice * (1 + minDiscountPercentage / 100)) /
          step;
        discountedPrice =
          prevTriggerPrice * (1 + minDiscountPercentage / 100) +
          slope * (i % step);
      }

      // Ensure discountedPrice is within the specified range
      discountedPrice = Math.min(
        discountedPrice,
        priceObj.price * (1 + minDiscountPercentage / 100)
      );
      discountedPrice = Math.max(
        discountedPrice,
        priceObj.price * (1 - maxDiscountPercentage / 100)
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
