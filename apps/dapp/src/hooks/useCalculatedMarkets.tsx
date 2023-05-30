import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as contractLibrary from "@bond-protocol/contract-library";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { providers } from "services/owned-providers";
import { Market } from "src/generated/graphql";
import { useLoadMarkets, useTokens } from "hooks";
import { dateMath } from "ui";

const FEE_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;

export function useCalculatedMarkets() {
  const { tokens, getByAddress, fetchedExtendedDetails } = useTokens();
  const { markets, isLoading: isMarketLoading } = useLoadMarkets();

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
    /*
      We cannot rely on the value of isLive from the subgraph, it only updates on events.
      If a market is manually closed, or closes after hitting capacity, the subgraph will
      be updated, and isLive will be false. However, if it hits its expiry date, there is
      no event, so the subgraph is not updated. Thus, we check here and return early if
      the market is not live.
    */

    //TODO: Move all to a background task on startup
    const isLive = await contractLibrary.isLive(
      market.marketId,
      requestProvider
    );

    //Checks if the market start date is in the future
    const willOpenInTheFuture =
      market.start &&
      dateMath.isBefore(new Date(), new Date(market.start * 1000));

    if (!isLive && !willOpenInTheFuture) {
      return;
    }

    const quoteToken = getByAddress(market.quoteToken.address);
    const payoutToken = getByAddress(market.payoutToken.address);

    const updatedMarket = { ...market, payoutToken, quoteToken };

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
        const quoteToken = tokens.find(
          (t) => t.address === x.quoteToken.address
        );
        const payoutToken = tokens.find(
          (t) => t.address === x.payoutToken.address
        );

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

  console.log("useCalc call");
  return {
    allMarkets: calculatedMarkets,
    refetchAllMarkets,
    refetchOne,
    isSomeLoading,
    isLoading: {
      market: isMarketLoading,
      priceCalcs: isCalculatingAll,
    },
  };
}
