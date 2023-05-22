import { sub, getUnixTime } from "date-fns";

export const generateCoingeckoFetch = (url: string) => {
  return async () => {
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
    let result = await fetch(
      publicUrl.concat(url).concat(import.meta.env.VITE_COINGECKO_API_KEY)
    );
    //}

    return result && (await result.json());
  };
};

export const generateFetcher = (url: string) => {
  return async () => {
    try {
      let result = await fetch(url);
      return (await result?.json()) ?? {};
    } catch (e) {
      console.error(`Failed to fetch ${url}`, e);
    }
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

  return generateCoingeckoFetch(
    `/coins/${apiId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`
  );
};
