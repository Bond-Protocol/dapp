import { BondChartDataset } from "components/organisms/LineChart";
import { calcDiscountPercentage } from "../utils/calculate-percentage";

const generateRange = (min: number, max: number, distance: number) => {
  const gapAmount = (max - min) / (distance + 1);
  return Array(distance)
    .fill(min)
    .map((num, i) => num + gapAmount * (i + 1));
};

export const interpolate = (dataset: Array<BondChartDataset>) => {
  //Sort from latest since we always know the current discount
  const purchases = Array.from(dataset).sort(
    (a, b) => Number(b.date) - Number(a.date)
  );

  let lastPrice = 0;
  let previousPrice = 0;

  for (let i = 0; i < purchases.length; i++) {
    const entry = purchases[i];
    if (entry.discountedPrice) {
      lastPrice = entry.discountedPrice;
      continue;
    }
    //How many elements exist between known prices
    let distance = 0;
    for (let j = i + 1; j < purchases.length; j++) {
      distance++;
      const next = purchases[j];
      if (!next.discount) {
      } else {
        previousPrice = next.discountedPrice || 0;
        break;
      }
    }

    generateRange(lastPrice, previousPrice, distance).forEach(
      (interpolatedPrice, idx) => {
        purchases[i + idx].discountedPrice = interpolatedPrice;
        purchases[i + idx].discount = calcDiscountPercentage(
          purchases[i + idx].price || 0,
          interpolatedPrice
        );
      }
    );
  }
  return purchases.reverse();
};
