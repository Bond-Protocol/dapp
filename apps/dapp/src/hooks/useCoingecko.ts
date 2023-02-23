import { useQuery } from "react-query";
import axios from "axios";
import { getUniqueApiIds } from "@bond-protocol/bond-library";

const apiIds = getUniqueApiIds();
const allIds = [...apiIds.coingecko].join(",");

//Loads all known by default
export const useMultipleTokensFromCoingecko = (tokenIds = allIds) => {
  return useQuery(["token-prices-", tokenIds], async () => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
    );

    return response.data;
  });
};
