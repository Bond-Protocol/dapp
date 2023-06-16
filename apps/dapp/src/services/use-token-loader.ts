import { useEffect, useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import { testnetTokenlist, tokenlist } from "hooks";
import * as defillama from "./defillama";
import { usdFormatter } from "../utils/format";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { environment } from "src/environment";
import { useSubgraph } from "hooks/useSubgraph";

export const fetchPrices = async (tokens: Array<Omit<Token, "price">>) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens.map((t: any) => ({
    ...t,
    chainId: Number(t.chainId),
    // @ts-ignore
    price: prices.find((p: any) => p.address === t.address)?.price ?? 0,
  }));
};

export const fetchAndMatchPricesForTestnet = async () => {
  const pricedTokens = await fetchPrices(tokenlist);

  return testnetTokenlist.map((t) => {
    const price = pricedTokens.find(
      (pt) => t.symbol.toLowerCase() === pt?.symbol?.toLowerCase()
    )?.price;

    return { ...t, price };
  });
};

export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [payoutTokens, setPayoutTokens] = useState<Token[]>([]);
  const [tbv, setTbv] = useState<number>(0);
  const { discoverFromApi } = useDiscoverToken();
  const [fetchedExtendedDetails, setFetchExtended] = useState(false);
  const { subgraphTokens, isLoading } = useSubgraph();

  const getByAddress = (address: string) => {
    return tokens.find(
      (t) => t.address.toLowerCase() === address?.toLowerCase()
    );
  };

  const getByChain = (chainId: number) =>
    tokens.filter((t) => t.chainId === chainId);

  const addToken = (token: Token) => {
    setUserTokens((prev) => [...prev, token]);
  };

  useEffect(() => {
    const loadPrices = async () => {
      if (!isLoading) {
        const tokens = subgraphTokens
          .map((t: any) => {
            return {
              ...t,
              chainId: Number(t.chainId),
              decimals: Number(t.decimals),
              logoUrl: "/placeholders/token-placeholder.png",
              logoURI: "/placeholders/token-placeholder.png",
            };
          })
          .concat(userTokens);

        const pricedTokens = environment.isTestnet
          ? await fetchAndMatchPricesForTestnet()
          : await fetchPrices(tokens);

        setTokens(pricedTokens);
        setFetchExtended(false);
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
          // @ts-ignore
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
        const updatedTokens = await discoverFromApi(tokens);
        setFetchExtended(true);
        setTokens(updatedTokens);
      }
    }

    fetchExtendedDetails();
  }, [tokens, fetchedExtendedDetails]);

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens,
    payoutTokens,
    getByAddress,
    getByChain,
    addToken,
    fetchedExtendedDetails,
  };
};
