import {
  getMarketTypeByAuctioneer,
  MarketPricing,
} from "@bond-protocol/contract-library";
import { add } from "date-fns";
import { CalculatedMarket } from "types";

import { dateMath, formatCurrency, formatDate } from "ui";

const pricingLabels: Record<MarketPricing, string> = {
  dynamic: "Dynamic Price Market",
  static: "Static Price Market",
  "oracle-static": "Static Oracle Market",
  "oracle-dynamic": "Dynamic Price Market",
};

export const getMarketLabels = (market: { auctioneer: string }) => {
  const type = getMarketTypeByAuctioneer(market.auctioneer);
  return pricingLabels[type];
};

export const useMarketDetails = (market: CalculatedMarket) => {
  if (!market) return {};

  const capacityInQuote =
    market.capacityToken.symbol === market.quoteToken.symbol;

  const maxPayout =
    (!capacityInQuote
      ? market.currentCapacity < Number(market.maxPayout)
        ? market.currentCapacity
        : market.maxPayout
      : market.maxPayout) ?? 0;

  const vestingDate = formatDate.short(new Date(market.vesting * 1000));

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? formatDate.short(add(Date.now(), { seconds: market.vesting }))
      : vestingDate;

  const startDate = market.start && new Date(market.start * 1000);
  const isFutureMarket =
    !!startDate && dateMath.isBefore(new Date(), startDate);

  const type = getMarketTypeByAuctioneer(market.auctioneer);
  const marketTypeLabel = pricingLabels[type];

  const discountLabel =
    !isNaN(market.discount) &&
    isFinite(market.discount) &&
    market.discount < 100
      ? formatCurrency.trimToken(market.discount).concat("%")
      : "Unknown";

  const maxPayoutLabel =
    Number(maxPayout) > 1
      ? formatCurrency.trimToLengthSymbol(Number(maxPayout))
      : formatCurrency.trimToken(maxPayout);

  const capacity =
    Number(market.currentCapacity) > 1
      ? formatCurrency.trimToLengthSymbol(Number(market.currentCapacity))
      : formatCurrency.trimToken(market.currentCapacity ?? 0);

  return {
    startDate,
    isFutureMarket,
    marketTypeLabel,
    discountLabel,
    maxPayoutLabel,
    capacity,
    vestingLabel: vestingLabel?.includes("Immediate")
      ? "Immediate"
      : vestingLabel,
  };
};
