import { sub, getUnixTime } from "date-fns";

export const generateFetcher = (url: string) => {
  return async () => {
    const result = await fetch(url);
    return result.json();
  };
};

export const getTokenPriceHistory = (
  apiId: string,
  range: Duration,
  to = Date.now()
) => {
  const from = sub(to, range);
  const fromTimestamp = getUnixTime(from);
  const toTimestamp = getUnixTime(to);

  return generateFetcher(
    `${import.meta.env.VITE_COINGECKO_BASE_URL}/coins/${apiId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}&x_cg_pro_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`
  );
};
