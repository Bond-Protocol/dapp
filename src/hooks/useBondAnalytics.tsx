import { sub, getUnixTime } from "date-fns";
import { useQuery } from "react-query";
import {
  BondPurchase,
  ListBondPurchasesPerMarketQuery,
  useListBondPurchasesPerMarketQuery,
} from "../generated/graphql";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { subgraphEndpoints } from "services/subgraph-endpoints";
import { generateFetcher, getClosest } from "../utils";
import { CHAIN_ID, TOKENS } from "@bond-protocol/bond-library";
import { BondChartDataset } from "components/organisms/LineChart";

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

const calcDiscountPercentage = (price: number, bondPrice: number) => {
  return (100 * (price - bondPrice)) / price;
};

const getMarketPriceAtPurchaseTime = (
  timestamp: number,
  prices: Array<{ date: number; price: number }>
) => {
  const priceDate = getClosest(
    prices?.map((d) => d.date),
    timestamp
  );
  const details = prices?.find((d) => d.date === priceDate)!;
  return details?.price || 0;
};

type createBondPurchaseDatasetArgs = { priceData: Array<number[]> } & Pick<
  ListBondPurchasesPerMarketQuery,
  "bondPurchases"
>;

const createBondPurchaseDataset = ({
  priceData,
  bondPurchases,
}: createBondPurchaseDatasetArgs): BondChartDataset[] => {
  const priceDetails = priceData?.map((d) => ({
    date: d[0],
    price: d[1],
  }));

  //@ts-ignore
  return bondPurchases?.reduce((entries, purchase) => {
    const date = Math.floor(purchase.timestamp * 1000);
    const price = getMarketPriceAtPurchaseTime(date, priceDetails);

    const purchaseEntry = {
      date,
      price,
      discount: calcDiscountPercentage(price, purchase.purchasePrice),
      discountedPrice: parseFloat(purchase.purchasePrice),
    };

    const postPurchaseEntry = {
      date,
      price,
      discount: calcDiscountPercentage(price, purchase.postPurchasePrice),
      discountedPrice: parseFloat(purchase.postPurchasePrice),
    };

    return [...entries, purchaseEntry, postPurchaseEntry];
  }, []);
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

  const prepped =
    createBondPurchaseDataset({
      priceData: priceData?.prices,
      bondPurchases: data?.bondPurchases as BondPurchase[],
    }) || [];

  const dataset = [
    ...prepped,
    {
      // add current information
      date: Date.now(),
      discountedPrice: market.discountedPrice,
      discount: market.discount,
      price: market.fullPrice,
    },
  ];

  return { isLoading, dataset, purchases: data?.bondPurchases };
};
