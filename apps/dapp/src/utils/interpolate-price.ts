import type { BondPriceDatapoint } from "ui";

export const generateRange = (min: number, max: number, distance: number) => {
  const gapAmount = (max - min) / (distance + 1);
  return Array(distance)
    .fill(min)
    .map((min, i) => min + gapAmount * (i + 1));
};

export const interpolate = (dataset: BondPriceDatapoint[]) => {
  //Sort from latest since we always know the current discount
  const purchases = [...dataset].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  let currentPrice = 0;
  let nextPrice = 0;

  for (let i = 0; i < purchases.length; i++) {
    const entry = purchases[i];
    if (entry.discountedPrice) {
      currentPrice = entry.discountedPrice;
      continue;
    }

    let elementsBetweenKnownPrices = 0;
    for (let j = i + 1; j < purchases.length; j++) {
      elementsBetweenKnownPrices++;
      const next = purchases[j];
      if (next.discountedPrice) {
        nextPrice = next.discountedPrice || 0;
        break;
      }
    }

    generateRange(currentPrice, nextPrice, elementsBetweenKnownPrices).forEach(
      (interpolatedPrice, idx) => {
        purchases[i + idx].discountedPrice = interpolatedPrice;
      }
    );
  }
  return purchases.reverse();
};
