import { useMemo, useState } from "react";
import { Token } from "types";
import { testnetTokenlist, tokenlist } from "hooks";
import * as defillama from "services/defillama";
import { usdFormatter } from "formatters";
import { useDiscoverFromApi } from "hooks/useDiscoverToken";
import { environment } from "src/environment";
import { PLACEHOLDER_TOKEN_LOGO_URL } from "src/utils";
import { useGetGlobalData } from "hooks/useGetGlobalData";
import { useQuery } from "@tanstack/react-query";

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
  //@ts-ignore fix: how to type a prop coming out of a json
  const pricedTokens = await fetchPrices(tokenlist);

  return testnetTokenlist.map((t) => {
    const price = pricedTokens.find(
      (pt) => t.symbol.toLowerCase() === pt?.symbol?.toLowerCase()
    )?.price;

    return { ...t, price, usedAsPayout: true, markets: [] };
  });
};

export const useTokens = () => {
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const { data, isLoading } = useGetGlobalData();
  const { subgraphTokens } = data;

  const { data: tokenlistTokens, ...tokenlistQuery } = useQuery({
    queryKey: ["tokenlist/prices", tokenlist.length],
    queryFn: async () => {
      const tokens = tokenlist.filter((t) => t.display === true);

      const pricedTokens = environment.isTestnet
        ? await fetchAndMatchPricesForTestnet()
        : //@ts-ignore
          await fetchPrices(tokens);

      return pricedTokens as Token[];
    },
  });

  const { data: tokens, ...query } = useQuery({
    enabled: !isLoading,
    queryKey: ["prices", subgraphTokens.length],
    placeholderData: [],
    queryFn: async () => {
      const tokens = subgraphTokens
        .map((t: any) => {
          return {
            ...t,
            chainId: Number(t.chainId),
            decimals: Number(t.decimals),
            logoURI: PLACEHOLDER_TOKEN_LOGO_URL,
          };
        })
        .concat(userTokens);

      const pricedTokens = environment.isTestnet
        ? await fetchAndMatchPricesForTestnet()
        : await fetchPrices(tokens);

      return pricedTokens as Token[];
    },
  });

  const { data: detailedTokens, ...detailedTokensQuery } = useDiscoverFromApi(
    tokens ?? []
  );

  const { data: detailedTokenlist, ...detailedTokenlistQuery } =
    useDiscoverFromApi(tokenlistTokens ?? []);

  const getByAddress = (address: string) => {
    return tokens?.find(
      (t) => t.address.toLowerCase() === address?.toLowerCase()
    );
  };

  const payoutTokens = useMemo(
    () =>
      tokens
        ?.filter((token) => token.usedAsPayout)
        .map((token) => {
          const tbv = token.payoutTokenTbvs?.reduce(
            (total, ptt) =>
              total +
              ptt.tbv * (getByAddress(ptt.quoteToken.address)?.price ?? 0),
            0
          );
          return { ...token, tbv };
        }) ?? [],
    [tokens?.length]
  );

  const tbv = useMemo(
    () => payoutTokens?.reduce((total, token) => total + (token.tbv ?? 0), 0),
    [payoutTokens.length]
  );

  const getByAddressAndChain = (address: string, chainId: string | number) => {
    return tokens?.find(
      (t) => t.address === address && t.chainId === Number(chainId)
    );
  };

  const getByChain = (chainId: number) =>
    tokens?.filter((t) => t.chainId === chainId);

  const addToken = (token: Token) => {
    setUserTokens((prev) => [...prev, token]);
  };

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens: (detailedTokensQuery.isSuccess
      ? detailedTokens
      : tokens ?? []) as Token[],
    tokenlist: (detailedTokenlistQuery.isSuccess
      ? detailedTokenlist
      : detailedTokens ?? []) as Token[],
    payoutTokens,
    getByAddress,
    getByChain,
    getByAddressAndChain,
    addToken,
    fetchedExtendedDetails: detailedTokensQuery.isSuccess,
    isLoading: query.isLoading,
  };
};
