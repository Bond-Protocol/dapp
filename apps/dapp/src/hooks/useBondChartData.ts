import {
  BondPurchase,
  ListBondPurchasesPerMarketQuery,
  useListBondPurchasesPerMarketQuery,
} from "../generated/graphql";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { getClosest } from "../utils";
import { BondChartDataset } from "components/organisms/LineChart";
import { calcDiscountPercentage } from "../utils/calculate-percentage";
import { interpolate } from "../utils/interpolate-price";
import { useTokenPriceHistory } from "./useTokenPricesHistory";
import { subgraphEndpoints } from "../services/subgraph-endpoints";

type PriceDataArray = Array<{ date: number; price: number }>;

type CreateBondPurchaseDatasetArgs = {
  priceData: PriceDataArray;
} & Pick<ListBondPurchasesPerMarketQuery, "bondPurchases">;

const getMarketPriceAtPurchaseTime = (
  timestamp: number,
  prices: PriceDataArray
) => {
  const priceDate = getClosest(
    prices?.map((d) => d.date),
    timestamp
  );
  const details = prices?.find((d) => d.date === priceDate)!;
  return { price: details?.price || 0, priceDate: priceDate };
};

const createBondPurchaseDataset = ({
  priceData = [],
  bondPurchases = [],
}: CreateBondPurchaseDatasetArgs): BondChartDataset[] => {
  const datesToRemove: number[] = [];

  const updatedPurchases =
    //@ts-ignore
    (bondPurchases.reduce((entries, purchase) => {
      const date = Math.floor(purchase.timestamp * 1000);
      const { price, priceDate } = getMarketPriceAtPurchaseTime(
        date,
        priceData
      );

      //Remove price used for a specific purchase to avoid slopes
      datesToRemove.push(priceDate);

      const purchaseEntry = {
        date,
        price,
        discountedPrice: parseFloat(purchase.purchasePrice),
      };

      const postPurchaseEntry = {
        date: date + 1,
        price,
        discountedPrice: parseFloat(purchase.postPurchasePrice),
      };

      return [...entries, purchaseEntry, postPurchaseEntry];
    }, []) as any[]) || [];

  //@ts-ignore
  const earliestPurchase = updatedPurchases?.sort((a, b) => a.date - b.date)[0]
    ?.date;

  return [
    ...updatedPurchases,
    ...priceData.filter(
      (d) => !datesToRemove.includes(d?.date) && d?.date > earliestPurchase
    ),
  ];
};

export const useBondChartData = (market: CalculatedMarket, dayRange = 30) => {
  const { prices: quoteTokenPrices, ...quoteTokenQuery } = useTokenPriceHistory(
    market.quoteToken,
    dayRange
  );

  const { prices: payoutTokenPrices, ...payoutTokenQuery } =
    useTokenPriceHistory(market.payoutToken, dayRange);

  const { data: purchaseData, ...purchasesQuery } =
    useListBondPurchasesPerMarketQuery(
      // @ts-ignore
      { endpoint: subgraphEndpoints[market.chainId as CHAIN_ID] },
      { marketId: market.id }
    );

  const earliestDate = market.creationBlockTimestamp * 1000;

  const dataset: BondChartDataset[] = createBondPurchaseDataset({
    priceData: payoutTokenPrices,
    bondPurchases: purchaseData?.bondPurchases as BondPurchase[],
  }).concat({
    date: Date.now(),
    discountedPrice: market.discountedPrice,
    discount: market.discount,
    price: market.fullPrice,
  });

  const isLoading = [quoteTokenQuery, payoutTokenQuery].some(
    (q) => q.isLoading
  );

  return {
    isLoading,
    purchases: purchaseData?.bondPurchases,
    dataset: interpolate(dataset)
      .filter((data) => data.date > earliestDate)
      .map((data) => ({
        ...data,
        discount: calcDiscountPercentage(data?.price, data?.discountedPrice),
      })),
  };
};
