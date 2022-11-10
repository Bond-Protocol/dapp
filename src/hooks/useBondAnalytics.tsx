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

type createBondPurchaseDatasetArgs = { priceData: Array<number[]> } & Pick<
  ListBondPurchasesPerMarketQuery,
  "bondPurchases"
>;

const getMarketPriceAtPurchaseTime = (
  timestamp: number,
  prices: Array<{ date: number; price: number }>
) => {
  const priceDate = getClosest(
    prices?.map((d) => d.date),
    timestamp
  );
  const details = prices?.find((d) => d.date === priceDate)!;
  return { price: details?.price || 0, priceDate: priceDate };
};

const createBondPurchaseDataset = ({
  priceData,
  bondPurchases,
}: createBondPurchaseDatasetArgs): BondChartDataset[] => {
  const priceDetails =
    priceData?.map((d) => ({
      date: d[0],
      price: d[1],
    })) || [];

  const datesToRemove: number[] = [];

  const updatedPurchases =
    //@ts-ignore
    bondPurchases?.reduce((entries, purchase) => {
      const date = Math.floor(purchase.timestamp * 1000);
      const { price, priceDate } = getMarketPriceAtPurchaseTime(
        date,
        priceDetails
      );

      datesToRemove.push(priceDate);
      const purchaseEntry = {
        date,
        price,
        discount: calcDiscountPercentage(price, purchase.purchasePrice),
        discountedPrice: parseFloat(purchase.purchasePrice),
      };

      const postPurchaseEntry = {
        date: date + 1000,
        price,
        discount: calcDiscountPercentage(price, purchase.postPurchasePrice),
        discountedPrice: parseFloat(purchase.postPurchasePrice),
      };

      return [...entries, purchaseEntry, postPurchaseEntry];
    }, []) || ([] as BondChartDataset[]);

  //@ts-ignore
  const earliestPurchase = updatedPurchases?.sort((a, b) => a.date - b.date)[0]
    ?.date;

  return (
    [
      ...priceDetails.filter((d) => !datesToRemove.includes(d.date)),
      //@ts-ignore
      ...updatedPurchases,
    ]
      .filter((p, i, self) => p.date > earliestPurchase)
      .sort((a, b) => a.date - b.date) || []
  );
};

export const useBondAnalytics = (market: CalculatedMarket, dayRange = 3) => {
  //@ts-ignore (TODO): fix bond-library types (again)
  const priceSources = TOKENS.get(market.payoutToken.id)?.priceSources || [];
  //@ts-ignore
  const tokenApiId = priceSources[0]?.apiId;

  const { data: priceData, ...priceQuery } = useQuery(
    `token-price-history-${market.payoutToken.symbol}`,
    getCoingeckoPriceHistory(tokenApiId, { days: dayRange }, Date.now())
  );

  const { data, ...purchaseQuery } = useListBondPurchasesPerMarketQuery(
    { endpoint: subgraphEndpoints[market.network as CHAIN_ID] },
    { marketId: market.id }
  );

  const isLoading = [priceQuery, purchaseQuery].some((q) => q.isLoading);

  const dataset = [
    ...createBondPurchaseDataset({
      priceData: priceData?.prices,
      bondPurchases: data?.bondPurchases as BondPurchase[],
    }),
    {
      date: Date.now(),
      discountedPrice: market.discountedPrice,
      discount: market.discount,
      price: market.fullPrice,
    },
  ];

  return {
    isLoading,
    dataset: interpolate(dataset).slice(0, dataset.length - 1),
    purchases: data?.bondPurchases,
  };
};
