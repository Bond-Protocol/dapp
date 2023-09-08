import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as contractLibrary from "@bond-protocol/contract-library";
import {
  CalculatedMarket,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";
import { Market } from "src/generated/graphql";
import { useTokens } from "hooks";
import { useSubgraph } from "hooks/useSubgraph";

const FEE_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

export function useCalculatedMarkets() {
  const { tokens, getByAddress, fetchedExtendedDetails } = useTokens();
  const { markets, isLoading: isMarketLoading } = useSubgraph();
  const [calculatedMarkets, setCalculatedMarkets] = useState<
    CalculatedMarket[]
  >([]);

  const calculateMarket = async (market: Market) => {
    const requestProvider = providers[market.chainId];
    const obsoleteAuctioneers = [
      "0x007f7a58103a31109f848df1a14f7020e1f1b28a",
      "0x007f7a6012a5e03f6f388dd9f19fd1d754cfc128",
      "0x007fea7a23da99f3ce7ea34f976f32bf79a09c43",
      "0x007fea2a31644f20b0fe18f69643890b6f878aa6",
    ];
    if (obsoleteAuctioneers.includes(market.auctioneer)) return;

    const quoteToken = getByAddress(market.quoteToken.address);
    const payoutToken = getByAddress(market.payoutToken.address);

    let updatedMarket = { ...market };
    // @ts-ignore
    quoteToken && (updatedMarket.quoteToken = quoteToken);
    // @ts-ignore
    payoutToken && (updatedMarket.payoutToken = payoutToken);

    try {
      const result = await contractLibrary.calcMarket(
        requestProvider,
        FEE_ADDRESS,
        // @ts-ignore
        updatedMarket
      );

      const blockExplorer = getBlockExplorer(result.chainId, "address");

      console.log({ blockExplorer });
      return {
        ...result,
        start: market.start,
        conclusion: market.conclusion,
        blockExplorerUrl: blockExplorer.blockExplorerUrl,
        blockExplorerName: blockExplorer.blockExplorerName,
      };
    } catch (e) {
      console.log(
        `ProtocolError: Failed to calculate market ${market.id} \n`,
        e
      );
      console.log(market);
      return market;
    }
  };

  const calculateAllMarkets = useQueries(
    markets.map((market: Market) => ({
      queryKey: market.id,
      queryFn: () => calculateMarket(market),
      enabled: tokens.length > 0,
    }))
  );

  const isCalculatingAll = calculateAllMarkets.some((m) => m.isLoading);

  const refetchOne = (id: string) => {
    const market = calculateAllMarkets.find((m) => m?.data?.id === id);
    market?.refetch();
  };

  const refetchAllMarkets = () => {
    calculateAllMarkets.forEach((result) => result.refetch());
  };

  useDeepCompareEffect(() => {
    if (!isCalculatingAll && Object.keys(tokens).length > 0) {
      const markets = calculateAllMarkets
        .filter((result) => result && result?.data)
        .map((r) => r.data)
        //@ts-ignore
        .map((market: CalculatedMarket) => {
          const quoteToken =
            getByAddress(market.quoteToken.address) || market.quoteToken;
          const payoutToken =
            getByAddress(market.payoutToken.address) || market.payoutToken;

          return {
            ...market,
            quoteToken,
            payoutToken,
          };
        });

      setCalculatedMarkets(markets);
    }
  }, [calculateAllMarkets, tokens]);

  useEffect(() => {
    const marketsExist = Boolean(calculatedMarkets.length);
    const tokensHaveLogos = tokens.some((t) => Boolean(t.logoURI));
    const marketTokensDontHaveLogos = calculatedMarkets.every(
      (m) =>
        m.quoteToken.logoURI?.includes("placeholder") ||
        m.quoteToken.logoURI?.includes("placeholder")
    );

    if (marketsExist && tokensHaveLogos && marketTokensDontHaveLogos) {
      const updatedMarkets = calculatedMarkets.map(
        (market: CalculatedMarket) => {
          const quoteToken =
            getByAddress(market.quoteToken.address) || market.quoteToken;
          const payoutToken =
            getByAddress(market.payoutToken.address) || market.payoutToken;

          return {
            ...market,
            quoteToken,
            payoutToken,
          };
        }
      );

      setCalculatedMarkets(updatedMarkets);
    }
  }, [calculatedMarkets.length, tokens, fetchedExtendedDetails]);

  const isLoading = {
    market: isMarketLoading,
    priceCalcs: isCalculatingAll,
  };

  const isSomeLoading = () => Object.values(isLoading).some((x) => x);

  return {
    allMarkets: calculatedMarkets,
    getMarketsForOwner: (address: string) =>
      calculatedMarkets.filter(
        (market: CalculatedMarket) =>
          market.owner.toLowerCase() === address?.toLowerCase()
      ),
    getByChainAndId: (chainId: number | string, id: number | string) =>
      calculatedMarkets.find(
        ({ marketId, chainId: marketChainId }) =>
          marketId === Number(id) && marketChainId === chainId
      ),
    refetchAllMarkets,
    refetchOne,
    isSomeLoading,
    isLoading: {
      market: isMarketLoading,
      priceCalcs: isCalculatingAll,
    },
  };
}
