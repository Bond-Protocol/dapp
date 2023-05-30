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
import { subgraphEndpoints } from "../services";
import { isAfter, sub } from "date-fns";
import { useChartDefillama } from "./useChartDefillama";

type PriceDataArray = Array<{ timestamp: number; price: number }>;

type CreateBondPurchaseDatasetArgs = {
  quoteTokenHistory: PriceDataArray;
  payoutTokenHistory: PriceDataArray;
} & Pick<ListBondPurchasesPerMarketQuery, "bondPurchases">;

const getClosestPrice = (timestamp: number, prices: PriceDataArray) => {
  const priceDate = getClosest(
    prices?.map((d) => d.timestamp),
    timestamp
  );
  const details = prices?.find((d) => d.timestamp === priceDate)!;
  return { price: details?.price || 0, timestamp: priceDate };
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
      const timestamp = Math.floor(purchase.timestamp * 1000);
      const { price: payoutTokenPrice, timestamp: priceDate } = getClosestPrice(
        timestamp,
        payoutTokenHistory
      );

      const { price: quoteTokenPrice } = getClosestPrice(
        timestamp,
        quoteTokenHistory
      );

      //Remove price used for a specific purchase to avoid slopes
      datesToRemove.push(priceDate);

      const purchaseEntry = {
        timestamp: timestamp,
        price: payoutTokenPrice,
        discountedPrice: parseFloat(purchase.purchasePrice) * quoteTokenPrice,
      };

      const postPurchaseEntry = {
        timestamp: timestamp + 1,
        price: payoutTokenPrice,
        discountedPrice:
          parseFloat(purchase.postPurchasePrice) * quoteTokenPrice,
      };

      return [...entries, purchaseEntry, postPurchaseEntry];
    }, []) as any[]) || [];

  const earliestPurchase = updatedPurchases?.sort(
    (a, b) => a.timestamp - b.timestamp
  )[0]?.timestamp;

  return [
    ...updatedPurchases,
    ...payoutTokenHistory.filter(
      (d) =>
        !datesToRemove.includes(d?.timestamp) && d?.timestamp > earliestPurchase
    ),
  ];
};

export const useBondChartData = (market: CalculatedMarket, dayRange = 90) => {
  //@ts-ignore

  const {
    chart,
    isLoading: isChartLoading,
    isValid,
  } = useChartDefillama([market.quoteToken, market.payoutToken]);

  const quote = chart.find((t) => t.address === market.quoteToken.address);
  const payout = chart.find((t) => t.address === market.payoutToken.address);

  //@ts-ignore
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
  const isLoading = isChartLoading || purchasesQuery.isLoading;

  //@ts-ignore
  const dataset: BondPriceDatapoint[] = createBondPurchaseDataset({
    payoutTokenHistory: payout?.prices!,
    quoteTokenHistory: quote?.prices!,
    bondPurchases: purchaseData?.bondPurchases as BondPurchase[],
  }).concat({
    timestamp: Date.now(),
    discountedPrice: market.discountedPrice,
    discount: market.discount,
    price: market.fullPrice,
  });

  return {
    isLoading,
    purchases: purchaseData?.bondPurchases,
    dataset: interpolate(dataset)
      .filter(
        (data) =>
          Number(data.timestamp) > marketCreationDate &&
          isAfter(Number(data.timestamp), sub(Date.now(), { days: dayRange }))
      )
      .map((data) => ({
        ...data,
        discount: calcDiscountPercentage(
          Number(data?.price),
          Number(data?.discountedPrice)
        ),
      })),
    isInvalid: !isValid,
  };
};
