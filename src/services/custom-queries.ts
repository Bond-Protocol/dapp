import { sub, getUnixTime } from "date-fns";

export const generateFetcher = (url: string) => {
  return async () => {
    const result = await fetch(url);
    return result.json();
  };
};

export const getCoingeckoPriceHistory = (
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
