import { useCallback, useMemo, useState } from "react";
import { MarketTokenPair, Token, TokenlistToken } from "@bond-protocol/types";
import { testnetTokenlist, tokenlist } from "../content";
import * as defillama from "services/defillama";
import { usdFormatter } from "formatters";
import { environment } from "src/environment";
import { PLACEHOLDER_TOKEN_LOGO_URL } from "src/utils";
import { useGetGlobalData } from "hooks/useGetGlobalData";
import { useQuery } from "@tanstack/react-query";
import { useTokenlists } from "src/data/useTokenlists";

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

export const fetchAndMatchPricesForTestnet = async (tokens: Token[] = []) => {
  //@ts-ignore fix: how to type a prop coming out of a json
  const pricedTokens = await fetchPrices(tokenlist);
  const subgraphTokens = tokens.map((t) => ({
    ...t,
    price: undefined,
    usedAsPayout: true,
  }));

  const tokenlistTokens = testnetTokenlist.map((t) => {
    const price = pricedTokens.find(
      (pt) => t.symbol.toLowerCase() === pt?.symbol?.toLowerCase()
    )?.price;

    return { ...t, price, usedAsPayout: true, markets: [] };
  });

  return [...tokenlistTokens, ...subgraphTokens];
};

export const useTokens = () => {
  const [userTokens, setUserTokens] = useState<Omit<Token, "name">[]>([]);
  const { data, isLoading } = useGetGlobalData();
  const { subgraphTokens } = data;
  const { data: tokenlistTokens, isSuccess: tokenlistQuerySuccess } =
    useTokenlists();

  const { data: quoteTokens, ...quoteTokensQuery } = useQuery({
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

  const { data: marketTokens, ...query } = useQuery({
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
        ? await fetchAndMatchPricesForTestnet(tokens)
        : await fetchPrices(tokens);

      return pricedTokens as Token[];
    },
  });

  const { data: detailedTokens, ...detailedTokensQuery } = useQuery({
    queryKey: ["match-tokens", "markets", marketTokens?.length],
    queryFn: () => matchTokens(marketTokens, tokenlistTokens),
    enabled: query.isSuccess && tokenlistQuerySuccess,
    placeholderData: [],
  });

  const { data: detailedQuoteTokens, ...detailedTokenlistQuery } = useQuery({
    queryKey: ["match-tokens", "quote", quoteTokens?.length],
    queryFn: () => matchTokens(quoteTokens, tokenlistTokens),
    enabled: quoteTokensQuery.isSuccess && tokenlistQuerySuccess,
    placeholderData: [],
  });

  const getByAddress = (address: string) => {
    return detailedTokens?.find(
      (t) => t.address.toLowerCase() === address?.toLowerCase()
    );
  };

  const payoutTokens = useMemo(
    () =>
      detailedTokens
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
    //TODO: improve
    [detailedTokens?.length ?? 0 > 0]
  );

  const tbv = useMemo(
    () => payoutTokens?.reduce((total, token) => total + (token.tbv ?? 0), 0),
    [payoutTokens.length]
  );

  const getByAddressAndChain = useCallback(
    (address: string, chainId: string | number) => {
      return detailedTokens?.find(
        (t) =>
          t.address.toLowerCase() === address.toLowerCase() &&
          t.chainId === Number(chainId)
      );
    },
    [detailedTokens]
  );

  const getTokenByAddressAndChain = useCallback(
    (token: Token) => {
      const detailedToken = getByAddressAndChain(token.address, token.chainId);
      return detailedToken ?? token;
    },
    [getByAddressAndChain]
  );

  const getByChain = useCallback(
    (chainId: number) =>
      detailedTokens?.filter((t) => t.chainId === chainId) ?? [],
    [detailedTokens]
  );

  const getTokenlistBychain = useCallback(
    (chainId: number) =>
      detailedQuoteTokens?.filter((t) => t.chainId === chainId) ?? [],
    [quoteTokens]
  );

  const matchTokenPair = useCallback(
    <T extends MarketTokenPair>(item: T): T => {
      const quoteToken = getTokenByAddressAndChain(item.quoteToken);
      const payoutToken = getTokenByAddressAndChain(item.payoutToken);
      return {
        ...item,
        quoteToken,
        payoutToken,
      };
    },
    [getTokenByAddressAndChain]
  );

  const addToken = (token: Omit<Token, "name">) => {
    setUserTokens((prev) => [...prev, token]);
  };

  return {
    tbv: usdFormatter.format(Math.trunc(tbv)),
    tokens: (detailedTokensQuery.isSuccess
      ? detailedTokens
      : marketTokens ?? []) as Token[],
    tokenlist: (detailedTokenlistQuery.isSuccess
      ? detailedQuoteTokens
      : detailedTokens ?? []) as Token[],
    payoutTokens,
    getByAddress,
    getByChain,
    getByAddressAndChain,
    getTokenlistBychain,
    addToken,
    matchTokenPair,
    fetchedExtendedDetails: detailedTokensQuery.isSuccess,
    isLoading: query.isLoading,
  };
};

/** * Adds tokenlists' tokens information to tokens from others sources */
function matchTokens(
  tokens: Token[] = [],
  tokenlist: TokenlistToken[] = []
): Token[] {
  if (tokens.length === 0 || tokenlist.length === 0) return tokens;
  return tokens.map((baseToken) => {
    const tokenlistToken = tokenlist.find(
      (targetToken) =>
        baseToken.address.toLowerCase() === targetToken.address.toLowerCase() &&
        baseToken.chainId === targetToken.chainId
    );

    if (!tokenlistToken) return baseToken;

    return { ...baseToken, ...tokenlistToken };
  });
}
