import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as contractLibrary from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";
import { Market } from "src/generated/graphql";
import { useTokens } from "hooks";
import { useGlobalSubgraphData } from "hooks/useGlobalSubgraphData";

const FEE_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

export function useCalculatedMarkets() {
  const { tokens, getByAddress, fetchedExtendedDetails } = useTokens();
  const { markets, isLoading: isMarketLoading } = useGlobalSubgraphData();
  const [calculatedMarkets, setCalculatedMarkets] = useState<
    CalculatedMarket[]
  >([]);

  useEffect(() => {
    const updatedMarkets: CalculatedMarket[] = [];
    calculatedMarkets.forEach((market: CalculatedMarket) => {
      const quoteToken = getByAddress(market.quoteToken.address);
      const payoutToken = getByAddress(market.payoutToken.address);

      let updatedMarket = { ...market };
      quoteToken && (updatedMarket.quoteToken = quoteToken);
      payoutToken && (updatedMarket.payoutToken = payoutToken);
      updatedMarkets.push(updatedMarket);
    });

    setCalculatedMarkets(updatedMarkets);
  }, [calculatedMarkets.length, fetchedExtendedDetails]);

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
    quoteToken && (updatedMarket.quoteToken = quoteToken);
    payoutToken && (updatedMarket.payoutToken = payoutToken);

    try {
      const result = await contractLibrary.calcMarket(
        requestProvider,
        FEE_ADDRESS,
        updatedMarket
      );

      return { ...result, start: market.start, conclusion: market.conclusion };
    } catch (e) {
      console.log(
        `ProtocolError: Failed to calculate market ${market.id} \n`,
        e
      );
      console.log(market);
    }
  };

  const calculateAllMarkets = useQueries(
    markets.map((market) => ({
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
        .map((r) => r.data);

      setCalculatedMarkets(markets);
    }
  }, [calculateAllMarkets, tokens]);

  useEffect(() => {
    if (
      Boolean(calculatedMarkets.length) &&
      tokens.some((t) => Boolean(t.logoURI)) &&
      !calculatedMarkets.some(
        (m) => Boolean(m.quoteToken.logoURI) || Boolean(m.quoteToken.logoURI)
      )
    ) {
      const updated = calculatedMarkets?.map((x) => {
        let quoteToken = tokens.find((t) => t.address === x.quoteToken.address);
        let payoutToken = tokens.find(
          (t) => t.address === x.payoutToken.address
        );

        if (!quoteToken) {
          quoteToken = x.quoteToken;
        }
        if (!payoutToken) {
          payoutToken = x.payoutToken;
        }

        return { ...x, quoteToken, payoutToken };
      });

      setCalculatedMarkets(updated);
    }
  }, [tokens, calculatedMarkets]);

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
          market.owner.toLowerCase() === address.toLowerCase()
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
