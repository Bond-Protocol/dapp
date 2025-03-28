import {
  ListBondPurchasesForRecipientQuery,
  ListBondPurchasesPerMarketQuery,
} from "src/generated/graphql";
import { Address } from "viem";

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export const loadBondPurchasesByMarket = async (
  marketId: string
): Promise<ListBondPurchasesPerMarketQuery> => {
  const response = await fetch(
    API_ENDPOINT + `markets/${marketId}/bondPurchases`
  );
  const bondPurchases = await response.json();

  return {
    bondPurchases: bondPurchases,
  };
};

export const loadBondPurchasesByAddress = async (
  address: Address | string
): Promise<ListBondPurchasesForRecipientQuery> => {
  const response = await fetch(API_ENDPOINT + `users/${address}/bondPurchases`);
  const data = await response.json();

  return { bondPurchases: data?.bondPurchases };
};
