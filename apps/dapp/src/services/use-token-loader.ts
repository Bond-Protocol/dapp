import { useEffect, useState } from "react";
import { useQueries } from "react-query";
import { tokenlist } from "@bond-protocol/bond-library";
import { liveMarketsFor, Token } from "@bond-protocol/contract-library";
import * as defillama from "./defillama";
import { currentEndpoints } from "./subgraph-endpoints";
import { generateGraphqlQuery } from "./custom-queries";
import { providers } from "services/owned-providers";
import { usdFormatter } from "../utils/format";

const fetchPrices = async (tokens: Token[]) => {
  const addresses = tokens.map(defillama.utils.toDefillamaQueryId);

  const prices = await defillama.fetchPrice(addresses);

  return tokens
    .map((t: any) => ({
      ...t,
      price: prices.find((p: any) => p.address === t.address)?.price,
    }))
    .filter((t: any) => !!t.price);
};

const listQuery = `query ListTokens { tokens { address chainId name decimals symbol usedAsPayout payoutTokenTbvs { tbv quoteToken { id address } } } }`;

/**
 *
 */
export const useTokenLoader = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [payoutTokens, setPayoutTokens] = useState<Token[]>([]);
  const [tbv, setTbv] = useState<number>(0);

  const queries = useQueries(
    currentEndpoints.map((e) => {
      return {
        queryKey: `list-all-tokens-${e.chain}`,
        queryFn: generateGraphqlQuery(listQuery, e.url),
      };
    })
  );

  const getByAddress = (address: string) => {
    if (address === "0x07e49d5de43dda6162fa28d24d5935c151875283") {
      console.log(
        tokens.find((t) => t.address.toLowerCase() === address.toLowerCase())
      );
    }
    return tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );
  };

  const isAnyLoading = queries.some((q) => q.isLoading);

  useEffect(() => {
    const loadPrices = async () => {
      const tokens = queries
        .flatMap((q) => q.data.data.tokens)
        .map((t) => ({
          ...t,
          openMarkets: [],
          logoUrl: tokenlist.find(
            (tok) => tok.address === t.address.toLowerCase()
          )?.logoURI,
        }));

      const pricedTokens = await fetchPrices(tokens);

      setTokens(pricedTokens);
    };

    loadPrices();
  }, [isAnyLoading]);

  useEffect(() => {
    const payoutTokens = tokens.filter((token) => token.usedAsPayout);
    let totalTbv = 0;
    payoutTokens.forEach((token) => {
      let tbv = 0;
      token.payoutTokenTbvs?.forEach((ptt) => {
        if (token.address === "0x07e49d5de43dda6162fa28d24d5935c151875283") {
          console.log({
            token,
            ptt,
            gba: getByAddress(ptt.quoteToken.address),
          });
        }
        tbv =
          tbv + (ptt.tbv * getByAddress(ptt.quoteToken.address)?.price || 0);
      });
      token.tbv = tbv;
      totalTbv = totalTbv + tbv;

      liveMarketsFor(token.address, true, providers[token.chainId]).then(
        (result) => {
          token.openMarkets = result.map((value) => Number(value));
        }
      );
    });

    setTbv(totalTbv);
    setPayoutTokens(payoutTokens);
  }, [tokens]);

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens,
    payoutTokens,
    getByAddress,
  };
};
