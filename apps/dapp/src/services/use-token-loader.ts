import { useEffect, useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import * as defillama from "./defillama";
import { usdFormatter } from "../utils/format";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { useGlobalSubgraphData } from "hooks/useGlobalSubgraphData";

export const fetchPrices = async (tokens: Array<Omit<Token, "price">>) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens.map((t: any) => ({
    ...t,
    chainId: Number(t.chainId),
    price: prices.find((p: any) => p.address === t.address)?.price,
  }));
};

/**
 *
 */
export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [payoutTokens, setPayoutTokens] = useState<Token[]>([]);
  const [tbv, setTbv] = useState<number>(0);
  const { discoverLogo } = useDiscoverToken();
  const [fetchedExtendedDetails, setFetchExtended] = useState(false);
  const {
    subgraphTokens,
    openMarketsByToken,
    closedMarketsByToken,
    futureMarketsByToken,
    isLoading,
  } = useGlobalSubgraphData();

  const getByAddress = (address: string) => {
    return tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );
  };

  useEffect(() => {
    const loadPrices = async () => {
      if (!isLoading) {
        const tokens = subgraphTokens.map((t: any) => {
          return {
            ...t,
            openMarkets: openMarketsByToken.get(t) || [],
            closedMarkets: closedMarketsByToken.get(t) || [],
            futureMarkets: futureMarketsByToken.get(t) || [],
            logoUrl: "/placeholders/token-placeholder.png",
            logoURI: "/placeholders/token-placeholder.png",
          };
        });

        const pricedTokens = await fetchPrices(tokens);
        setTokens(pricedTokens);
      }
    };

    loadPrices();
  }, [isLoading]);

  useEffect(() => {
    const payoutTokens = tokens.filter((token) => token.usedAsPayout);
    let totalTbv = 0;
    payoutTokens.forEach((token) => {
      let tbv = 0;
      token.payoutTokenTbvs?.forEach((ptt) => {
        tbv =
          tbv + (ptt.tbv * getByAddress(ptt.quoteToken.address)?.price || 0);
      });
      token.tbv = tbv;
      totalTbv = totalTbv + tbv;
    });

    setTbv(totalTbv);
    setPayoutTokens(payoutTokens);
  }, [tokens]);

  useEffect(() => {
    async function fetchExtendedDetails() {
      if (Boolean(tokens.length) && !fetchedExtendedDetails) {
        const updatedTokens = await Promise.all(
          tokens.map((t) => discoverLogo(t))
        );
        setFetchExtended(true);
        setTokens(updatedTokens);
      }
    }

    fetchExtendedDetails();
  }, [tokens]);

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens,
    payoutTokens,
    getByAddress,
    fetchedExtendedDetails,
  };
};
