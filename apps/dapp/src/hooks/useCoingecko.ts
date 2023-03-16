import { useQuery } from "react-query";
import axios from "axios";
import { getUniqueApiIds } from "@bond-protocol/bond-library";

const apiIds = getUniqueApiIds();
const allIds = [...apiIds.coingecko].join(",");

//Loads all known by default
export const useMultipleTokensFromCoingecko = (tokenIds = allIds) => {
  return useQuery(["token-prices-", tokenIds], async () => {
    const proxyUrl = import.meta.env.VITE_COINGECKO_PRO_PROXY_URL;
    let isError = false;
    let response;

    if (proxyUrl && proxyUrl.length !== 0) {
      response = await axios.get(
        `${proxyUrl}/simple/price?ids=${tokenIds}&vs_currencies=usd`
      ).catch(() => {
        isError = true;
      });
    }

    if (!proxyUrl || proxyUrl.length === 0 || isError) {
      response = await axios.get(
        `${import.meta.env.VITE_COINGECKO_PUBLIC_URL}/simple/price?ids=${tokenIds}&vs_currencies=usd`
      );
    }

    return response && response.data;
  });
};
