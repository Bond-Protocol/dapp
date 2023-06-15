import { getUnixTime, sub } from "date-fns";
import { generateFetcher } from "./custom-queries";

const platforms: Record<number, string> = {
  /** Maps chain ids to coingecko platform format*/
  1: "ethereum",
  42161: "arbitrum-one",
  10: "optimistic-ethereum",
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
    address: t.detail_platforms[t.asset_platform_id].contract_address,
    decimals: t.detail_platforms[t.asset_platform_id].decimal_place,
    price: t.market_data.current_price.usd,
    details: {
      description: t.description.en,
      links: {
        coingecko: "https://coingecko.com/en/coins/".concat(t.id),
        homepage: t.links?.homepage?.[0],
        twitter:
          t.links?.twitter_screen_name &&
          "https://twitter.com/".concat(t.links?.twitter_screen_name),
        telegram:
          t.links?.telegram_channel_identifier &&
          "https://t.me/".concat(t.links?.telegram_channel_identifier),
        discord: t.links?.chat_url.filter(
          (url: string) => url.indexOf("https://discord.gg") !== -1
        )[0],
        medium: t.links?.announcement_url
          .concat(t.links?.chat_url)
          .concat(t.links?.official_forum_url)
          .filter((url: string) => url.indexOf("medium.com") !== -1)[0],
        everipedia: "https://iq.wiki/api/address-to-wiki?address=".concat(
          t.detail_platforms[t.asset_platform_id].contract_address
        ),
      },
    },
  };
};

export default {
  getTokenByContract,
  getTokenPriceHistory,
};
