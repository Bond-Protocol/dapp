import { BondChartDataset } from "components/molecules/LineChart";

export const generateRange = (min: number, max: number, distance: number) => {
  const gapAmount = (max - min) / (distance + 1);
  return Array(distance)
    .fill(min)
    .map((min, i) => min + gapAmount * (i + 1));
};

export const interpolate = (dataset: BondChartDataset[]) => {
  //Sort from latest since we always know the current discount
  const purchases = Array.from(dataset).sort(
    (a, b) => Number(b.date) - Number(a.date)
  );

  let currentPrice = 0;
  let nextPrice = 0;

  for (let i = 0; i < purchases.length; i++) {
    const entry = purchases[i];
    if (entry.discountedPrice) {
      currentPrice = entry.discountedPrice;
      continue;
    }
    //How many elements exist between known prices
    let distance = 0;
    for (let j = i + 1; j < purchases.length; j++) {
      distance++;
      const next = purchases[j];
      if (next.discountedPrice) {
        nextPrice = next.discountedPrice || 0;
        break;
      }
    }

    generateRange(currentPrice, nextPrice, distance).forEach(
      (interpolatedPrice, idx) => {
        purchases[i + idx].discountedPrice = interpolatedPrice;
      }
    );
  }
  return purchases.reverse();
};
