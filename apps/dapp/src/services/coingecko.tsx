import { sub, getUnixTime } from "date-fns";
import { generateFetcher } from "./custom-queries";

export const generateCoingeckoFetch = (url: string) => {
  /*
    const proxyUrl = import.meta.env.VITE_COINGECKO_PRO_PROXY_URL;
    let isError = false;
    let result;
    if (proxyUrl && proxyUrl.length !== 0) {
      result = await fetch(proxyUrl.concat(url))
        .catch(() => {
          isError = true;
        });
    }
    if (!proxyUrl || proxyUrl.length === 0 || isError) {
     */
  const publicUrl = import.meta.env.VITE_COINGECKO_PUBLIC_URL;
  const composedUrl = publicUrl
    .concat(url)
    .concat(import.meta.env.VITE_COINGECKO_API_KEY);

  return generateFetcher(composedUrl);
};

export const getTokenPriceHistory = (
  apiId: string,
  range: Duration,
  to = Date.now()
) => {
  const from = sub(to, range);
  const fromTimestamp = getUnixTime(from);
  const toTimestamp = getUnixTime(to);
  const url = `/coins/${apiId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;

  return generateCoingeckoFetch(url);
};

type SupportedChainIds = 1 | 42161;
const platforms: Record<SupportedChainIds, string> = {
  /** Maps chain ids to coingecko platform format*/
  1: "ethereum",
  42161: "arbitrum-one",
};

export const getTokenByContract = (
  address: string,
  chain: SupportedChainIds
) => {
  const platform = platforms[chain];
  const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`;
  return generateCoingeckoFetch(url);
};
