import {
  BondPurchase,
  ListBondPurchasesPerMarketQuery,
  useListBondPurchasesPerMarketQuery,
} from "../generated/graphql";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { getClosest } from "../utils";
import type { BondPriceDatapoint } from "ui";
import { calcDiscountPercentage } from "../utils/calculate-percentage";
import { interpolate } from "../utils/interpolate-price";
import { useTokenPriceHistory } from "./useTokenPricesHistory";
import { subgraphEndpoints } from "../services";
import { isAfter, sub } from "date-fns";

type PriceDataArray = Array<{ date: number; price: number }>;

type CreateBondPurchaseDatasetArgs = {
  quoteTokenHistory: PriceDataArray;
  payoutTokenHistory: PriceDataArray;
} & Pick<ListBondPurchasesPerMarketQuery, "bondPurchases">;

const getClosestPrice = (timestamp: number, prices: PriceDataArray) => {
  const priceDate = getClosest(
    prices?.map((d) => d.date),
    timestamp
  );
  const details = prices?.find((d) => d.date === priceDate)!;
  return { price: details?.price || 0, date: priceDate };
};

const createBondPurchaseDataset = ({
  bondPurchases = [],
  quoteTokenHistory = [],
  payoutTokenHistory = [],
}: CreateBondPurchaseDatasetArgs): BondPriceDatapoint[] => {
  const datesToRemove: number[] = [];

  const updatedPurchases =
    //@ts-ignore
    (bondPurchases.reduce((entries, purchase) => {
      const date = Math.floor(purchase.timestamp * 1000);

      const { price: payoutTokenPrice, date: priceDate } = getClosestPrice(
        date,
        payoutTokenHistory
      );

      const { price: quoteTokenPrice } = getClosestPrice(
        date,
        quoteTokenHistory
      );

      //Remove price used for a specific purchase to avoid slopes
      datesToRemove.push(priceDate);

      const purchaseEntry = {
        date,
        price: payoutTokenPrice,
        discountedPrice: parseFloat(purchase.purchasePrice) * quoteTokenPrice,
      };

      const postPurchaseEntry = {
        date: date + 1,
        price: payoutTokenPrice,
        discountedPrice:
          parseFloat(purchase.postPurchasePrice) * quoteTokenPrice,
      };

      return [...entries, purchaseEntry, postPurchaseEntry];
    }, []) as any[]) || [];

  //@ts-ignore
  const earliestPurchase = updatedPurchases?.sort((a, b) => a.date - b.date)[0]
    ?.date;

  return [
    ...updatedPurchases,
    ...payoutTokenHistory.filter(
      (d) => !datesToRemove.includes(d?.date) && d?.date > earliestPurchase
    ),
  ];
};

export const useBondChartData = (market: CalculatedMarket, dayRange = 90) => {
  //@ts-ignore
  const { prices: quoteTokenHistory, ...quoteTokenQuery } =
    useTokenPriceHistory(market.quoteToken);

  //@ts-ignore
  const { prices: payoutTokenHistory, ...payoutTokenQuery } =
    useTokenPriceHistory(market.payoutToken);

  const { data: purchaseData, ...purchasesQuery } =
    useListBondPurchasesPerMarketQuery(
      {
        // @ts-ignore
        endpoint: subgraphEndpoints[market.chainId as CHAIN_ID],
        fetchParams: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      },
      { marketId: market.id }
    );

  const marketCreationDate = market.creationBlockTimestamp * 1000;

  //@ts-ignore
  const dataset: BondPriceDatapoint[] = createBondPurchaseDataset({
    payoutTokenHistory,
    quoteTokenHistory,
    bondPurchases: purchaseData?.bondPurchases as BondPurchase[],
  }).concat({
    date: Date.now(),
    discountedPrice: market.discountedPrice,
    discount: market.discount,
    price: market.fullPrice,
  });

  const isLoading = [quoteTokenQuery, payoutTokenQuery, purchasesQuery].some(
    (q) => q.isLoading
  );

  return {
    isLoading,
    purchases: purchaseData?.bondPurchases,
    dataset: interpolate(dataset)
      .filter(
        (data) =>
          Number(data.date) > marketCreationDate &&
          isAfter(Number(data.date), sub(Date.now(), { days: dayRange }))
      )
      .map((data) => ({
        ...data,
        discount: calcDiscountPercentage(
          Number(data?.price),
          Number(data?.discountedPrice)
        ),
      })),
    isInvalid: quoteTokenQuery?.isInvalid || payoutTokenQuery?.isInvalid,
  };
};
