import { CreateMarketState } from "ui";

export const doPriceMath = (state: CreateMarketState) => {
  let rates = state.priceModels[state.priceModel];

  const price = Number(rates?.initialPrice).toExponential();
  const minPrice = Number(rates?.minPrice).toExponential();

  const priceSymbolIndex = price.indexOf("e") + 1;
  const minSymbolIndex = minPrice.indexOf("e") + 1;

  const priceCoefficient = Number(price.substring(0, priceSymbolIndex - 1));
  const minPriceCoefficient = Number(minPrice.substring(0, minSymbolIndex - 1));

  // The exchange rates are the price of the payout token divided by the price of the quote token
  // Therefore, the coefficient is already calculated for us.
  // We can get the difference in the price decimals (payoutPriceDecimals - quotePriceDecimals) from the exponent of the exchange rate.
  const priceDecimalDiff = Number(price.substring(priceSymbolIndex));
  const minPriceDecimalDiff = Number(minPrice.substring(minSymbolIndex));

  const tokenDecimalOffset =
    state.payoutToken.decimals - state.quoteToken.decimals;

  let priceDecimalOffset = priceDecimalDiff / 2;

  priceDecimalOffset > 0
    ? (priceDecimalOffset = Math.floor(priceDecimalOffset))
    : (priceDecimalOffset = Math.ceil(priceDecimalOffset));

  const scaleAdjustment = tokenDecimalOffset - priceDecimalOffset;

  const exp =
    36 +
    scaleAdjustment +
    state.quoteToken.decimals -
    state.payoutToken.decimals +
    priceDecimalDiff;

  // Calculate the decimal difference in the initial price and minimum price to offset the exponent
  const minPriceOffset = minPriceDecimalDiff - priceDecimalDiff;

  const minExp = exp + minPriceOffset;

  const matcher = /\.|,/g;
  // Compile prices into strings for market creation
  const formattedInitialPrice = (priceCoefficient * Math.pow(10, exp))
    .toLocaleString()
    .replaceAll(matcher, "");

  const formattedMinimumPrice = (minPriceCoefficient * Math.pow(10, minExp))
    .toLocaleString()
    .replaceAll(matcher, "");

  return {
    scaleAdjustment,
    formattedMinimumPrice,
    formattedInitialPrice,
  };
};

export const calculateDebtBuffer = (
  marketDurationInDays: number,
  bondsPerWeek: number,
  capacity: number
) => {
  const duration = marketDurationInDays * 24 * 60 * 60;
  const depositInterval = (24 * 60 * 60) / (bondsPerWeek / 7);
  const decayInterval = Math.max(5 * depositInterval, 3 * 24 * 24 * 60);
  return Math.round(
    ((capacity * 0.25) / ((capacity * decayInterval) / duration)) * 100
  );
};
