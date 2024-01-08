import { useQueries } from "@tanstack/react-query";
import { GetGlobalDataQuery } from "src/generated/graphql";
import { useTokens } from "hooks";
import { clients } from "context/blockchain-provider";
import {
  CalculatedMarket,
  calculateMarket as calculateBondMarket,
} from "@bond-protocol/contract-library";
import { Address } from "viem";
import { useGetGlobalData } from "./useGetGlobalData";

const FEE_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

const obsoleteAuctioneers = [
  "0x007f7a58103a31109f848df1a14f7020e1f1b28a",
  "0x007f7a6012a5e03f6f388dd9f19fd1d754cfc128",
  "0x007fea7a23da99f3ce7ea34f976f32bf79a09c43",
  "0x007fea2a31644f20b0fe18f69643890b6f878aa6",
];

export function useCalculatedMarkets() {
  const { tokens, getByAddress, isLoading: areTokensLoading } = useTokens();

  const { data, isLoading: isMarketLoading } = useGetGlobalData();
  const { markets } = data;

  const calculateMarket = async (
    market: NonNullable<GetGlobalDataQuery["tokens"][number]["markets"]>[number]
  ) => {
    if (obsoleteAuctioneers.includes(market.auctioneer)) return;

    const quoteToken = getByAddress(market.quoteToken.address);
    const payoutToken = getByAddress(market.payoutToken.address);

    const updatedMarket = { ...market, quoteToken, payoutToken };

    const publicClient = clients[Number(market.chainId)];

    try {
      const result = await calculateBondMarket(
        //@ts-ignore
        updatedMarket,
        publicClient,
        FEE_ADDRESS as Address
      );

      return {
        ...result,
        start: market.start,
        conclusion: market.conclusion,
      };
    } catch (e) {
      console.log(
        `ProtocolError: Failed to calculate market ${market.id} \n`,
        e
      );
      return Promise.reject(e);
    }
  };

  const { results: calculatedMarkets, isCalculatingAll } = useQueries({
    queries: markets.map(
      (
        market: NonNullable<
          GetGlobalDataQuery["tokens"][number]["markets"]
        >[number]
      ) => ({
        queryKey: [market.id],

        queryFn: () => calculateMarket(market),
        enabled: tokens.length > 0,
      })
    ),
    combine: (results) => ({
      //TODO: prevent this cast
      results: (results.filter((q) => q.data).map((q) => q.data) ??
        []) as CalculatedMarket[],
      isCalculatingAll: results.some((r) => r.isLoading),
    }),
  });

  const isLoading = {
    market: isMarketLoading,
    priceCalcs: isCalculatingAll,
    isMatchingTokens: isCalculatingAll,
    tokens: areTokensLoading,
  };

  const isSomeLoading = Object.values(isLoading).some((x) => x);

  return {
    isSomeLoading,
    isLoading,
    allMarkets: calculatedMarkets,
    getMarketsForOwner: (address: string) =>
      calculatedMarkets.filter(
        (market) => market?.owner.toLowerCase() === address?.toLowerCase()
      ),
    getByChainAndId: (chainId: number | string, id: number | string) =>
      calculatedMarkets.find(
        ({ marketId, chainId: marketChainId }) =>
          marketId.toString() === id && marketChainId === chainId
      ),
  };
}
