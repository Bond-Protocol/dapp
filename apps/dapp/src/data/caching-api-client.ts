import axios from "axios";
import { ListBondPurchasesPerMarketQuery } from "src/generated/graphql";

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export const loadBondPurchases = async (
  marketId: string
): Promise<ListBondPurchasesPerMarketQuery> => {
  const response = await axios.get(
    API_ENDPOINT + `markets/${marketId}/bondPurchases`
  );

  return {
    bondPurchases: response.data?.bondPurchases ?? [],
  };
};
