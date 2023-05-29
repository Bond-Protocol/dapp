import { useEffect, useState } from "react";
import { useQueries } from "react-query";
import { tokenlist } from "@bond-protocol/bond-library";
import { liveMarketsFor, Token } from "@bond-protocol/contract-library";
import * as defillama from "./defillama";
import { currentEndpoints } from "./subgraph-endpoints";
import { generateGraphqlQuery } from "./custom-queries";
import { providers } from "services/owned-providers";
import { usdFormatter } from "../utils/format";
import { BigNumberish } from "ethers";
import { useDiscoverToken } from "hooks/useDiscoverToken";

export const fetchPrices = async (tokens: Array<Omit<Token, "price">>) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens
    .map((t: any) => ({
      ...t,
      chainId: Number(t.chainId),
      price: prices.find((p: any) => p.address === t.address)?.price,
    }))
    .filter((t: any) => !!t.price);
};

const listQuery = `query ListTokens { tokens { address chainId name decimals symbol usedAsPayout uniqueBonders { count } payoutTokenTbvs { tbv quoteToken { id address } } } }`;

/**
 *
 */
export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [payoutTokens, setPayoutTokens] = useState<Token[]>([]);
  const [tbv, setTbv] = useState<number>(0);
  const { discoverLogo } = useDiscoverToken();
  const [fetchedLogos, setFetchedLogos] = useState(false);

  const queries = useQueries(
    currentEndpoints.map((e) => {
      return {
        queryKey: `list-all-tokens-${e.chain}`,
        queryFn: generateGraphqlQuery(listQuery, e.url),
      };
    })
  );

  const getByAddress = (address: string) => {
    return tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );
  };

  const isAnyLoading = queries.some((q) => q.isLoading);

  useEffect(() => {
    const promises: Promise<any>[] = [];
    const loadPrices = async () => {
      if (!isAnyLoading) {
        const tokens = queries
          .flatMap((q) => q.data?.data?.tokens)
          .map((t) => {
            const promise = liveMarketsFor(
              t.address,
              true,
              providers[t.chainId]
            ).then((result) => {
              const results: BigNumberish[] = [];
              result.forEach((res) => results.push(Number(res)));
              return results;
            });

            promises.push(promise);
            return {
              ...t,
              openMarkets: [],
              logoUrl: tokenlist.find(
                (tok) => tok?.address === t?.address.toLowerCase()
              )?.logoURI,
            };
          });

        const pricedTokens = await fetchPrices(tokens);
        const result = await Promise.allSettled(promises);
        result.forEach((result, index) => {
          if (!pricedTokens[index]) return;
          pricedTokens[index].openMarkets = result.value;
        });

        setTokens(pricedTokens);
      }
    };

    loadPrices();
  }, [isAnyLoading]);

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
    async function fetchLogos() {
      if (Boolean(tokens.length) && !fetchedLogos) {
        const updatedTokens = await Promise.all(
          tokens.map((t) => discoverLogo(t))
        );
        setFetchedLogos(true);
        setTokens(updatedTokens);
      }
    }
    fetchLogos();
  }, [tokens]);

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens,
    payoutTokens,
    getByAddress,
  };
};
