import { useQuery } from "react-query";
import {
  BondPurchase,
  ListBondPurchasesPerMarketQuery,
  useListBondPurchasesPerMarketQuery,
} from "../generated/graphql";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { getClosest } from "../utils";
import { CHAIN_ID, TOKENS } from "@bond-protocol/bond-library";
import { BondChartDataset } from "components/organisms/LineChart";
import { calcDiscountPercentage } from "../utils/calculate-percentage";
import { interpolate } from "../utils/interpolate-price";
import { getCoingeckoPriceHistory } from "services/custom-queries";

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

export const useBondChartData = (market: CalculatedMarket, dayRange = 3) => {
  //@ts-ignore (TODO): fix bond-library types (again)
  const priceSources = TOKENS.get(market.payoutToken.id)?.priceSources || [];
  //@ts-ignore
  const tokenApiId = priceSources[0]?.apiId;

  const { data: priceData, ...priceQuery } = useQuery(
    `token-price-history-${market.payoutToken.symbol}-${dayRange}`,
    getCoingeckoPriceHistory(tokenApiId, { days: dayRange }, Date.now())
  );
  const { data, ...purchaseQuery } = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[market.network as CHAIN_ID] },
    { marketId: market.id }
  );

  const _priceData = priceData?.prices?.map((x: Array<number>) => ({
    date: x[0],
    price: x[1],
  }));

  const earliestDate = _priceData?.[0]?.date;
  const dataset: BondChartDataset[] = createBondPurchaseDataset({
    priceData: _priceData,
    bondPurchases: data?.bondPurchases as BondPurchase[],
  }).concat({
    date: Date.now(),
    discountedPrice: market.discountedPrice,
    discount: market.discount,
    price: market.fullPrice,
  });

  const isLoading = [priceQuery, purchaseQuery].some((q) => q.isLoading);
  return {
    isLoading,
    purchases: data?.bondPurchases,
    dataset: interpolate(dataset)
      .slice(0, dataset.length - 1)
      .filter((d) => d.date > earliestDate)
      .map((data) => ({
        ...data,
        discount: calcDiscountPercentage(data?.price, data?.discountedPrice),
      })),
  };
};
