import { getUnixTime, sub } from "date-fns";
import { generateFetcher } from "./custom-queries";

const platforms: Record<number, string> = {
  /** Maps chain ids to coingecko platform format*/
  1: "ethereum",
  42161: "arbitrum-one",
};

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
    .concat("?" + import.meta.env.VITE_COINGECKO_API_KEY);

  return generateFetcher(composedUrl);
};

export const getTokenPriceHistory = (
  address: string,
  chainId: number,
  range: Duration,
  to = Date.now()
) => {
  const platform = platforms[chainId];
  const from = sub(to, range);
  const fromTimestamp = getUnixTime(from);
  const toTimestamp = getUnixTime(to);
  const url = `/coins/${platform}/contract/${address}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;

  return generateCoingeckoFetch(url);
};

export const getTokenByContract = async (address: string, chainId: number) => {
  const platform = platforms[chainId];
  const url = `/coins/${platform}/contract/${address}`;
  const token = await generateCoingeckoFetch(url)();
  return { ...formatToken(token), chainId };
};

const formatToken = (t: any) => {
  return {
    logoURI: t.image.large,
    symbol: t.symbol,
    name: t.name,
    address: t.detail_platforms[t.asset_platform_id].address,
    decimals: t.detail_platforms[t.asset_platform_id].decimal_place,
    price: t.market_data.current_price.usd,
    details: {
      description: t.description.en,
      links: {
        homepage: t.links?.homepage?.[0],
      },
    },
  };
};

export default {
  getTokenByContract,
  getTokenPriceHistory,
};
