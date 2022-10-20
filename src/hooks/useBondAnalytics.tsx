import { sub, getUnixTime } from "date-fns";
import { useQuery } from "react-query";
import {
  BondPurchase,
  useListBondPurchasesPerMarketQuery,
} from "../generated/graphql";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { generateFetcher, getClosest } from "../utils";
import { CHAIN_ID, TOKENS } from "@bond-protocol/bond-library";
import { useMemo } from "react";

const getCoingeckoPriceHistory = (
  apiId: string,
  range: Duration,
  to = Date.now()
) => {
  const from = sub(to, range);
  const fromTimestamp = getUnixTime(from);
  const toTimestamp = getUnixTime(to);

  return generateFetcher(
    `https://api.coingecko.com/api/v3/coins/${apiId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`
  );
};

const calcDiscount = (amount: string, payout: string, price: number) => {
  const discountedPrice = (parseFloat(amount) * price) / parseFloat(payout);
  const discount = (100 * (price - discountedPrice)) / price;
  return { discount, discountedPrice };
};

const purchasesToDataset = (
  priceData: Array<number[]>,
  purchases: BondPurchase[]
) => {
  const priceTimestamps = priceData?.map((d) => ({
    date: getUnixTime(d[0]),
    price: d[1],
  }));

  const updatedPurchases = purchases?.map((p) => {
    //Get closest timestamp of the price at time of purchase
    const date = getClosest(
      priceTimestamps?.map((d) => d.date),
      p.timestamp
    );

    const { price } = priceTimestamps?.find((d) => d.date === date)!;

    const discount = calcDiscount(p?.amount, p?.payout, price);

    return { date, price, ...discount };
  });

  return priceTimestamps?.map((p) => {
    const res = updatedPurchases.find(({ date }) => p.date === date);
    return res ? res : { ...p, discountedPrice: p.price };
  });
};

/**
 * Aims to be a reusable way to get all desirable information about a bond market
 * For now, only does bond discounts
 **/
export const useBondAnalytics = (market: CalculatedMarket, dayRange = 3) => {
  const purchaseData = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[market.network as CHAIN_ID] },
    { marketId: market.id }
  );

  //@ts-ignore (TODO): fix bond-library types (again)
  const { priceSources } = TOKENS.get(market.payoutToken.id);
  const tokenApiId = priceSources[0].apiId;

  const { data: priceData } = useQuery(
    `token-price-history-${market.payoutToken.symbol}`,
    getCoingeckoPriceHistory(tokenApiId, { days: dayRange }, Date.now())
  );

  const result = purchasesToDataset(
    priceData?.prices,
    purchaseData?.data?.bondPurchases
  );

  return result;
};
