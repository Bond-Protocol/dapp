import { Token, TokenBase } from "types";
import defillama from "services/defillama";
import coingecko from "services/coingecko";
import axios from "axios";
import { Address, getContract, isAddress } from "viem";
import { PublicClient, erc20ABI, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

const fetchOnChain = async (
  address: Address,
  chainId: number,
  publicClient: PublicClient
): Promise<Omit<Token, "price" | "address"> & { address: Address }> => {
  try {
    const contract = getContract({
      address,
      abi: erc20ABI,
      publicClient,
    });

    const [name, symbol, decimals] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
    ]);

    return {
      address,
      chainId,
      name,
      symbol,
      decimals,
    };
  } catch (e) {
    console.log("Failed to fetch ERC20", e);
    return {} as Token;
  }
};

export const useDiscoverToken = ({ address, chainId }: TokenBase) => {
  const publicClient = usePublicClient();

  const query = useQuery({
    queryKey: ["find/token-price", address, chainId],
    queryFn: async () => {
      const [token] = await defillama.fetchPrice(address, chainId);

      if (token?.price) {
        return { token, source: "defillama" };
      }

      const onChainToken = await fetchOnChain(address, chainId, publicClient);

      if (onChainToken.decimals) {
        return { token: onChainToken, source: "on-chain" };
      }

      return { source: "", token: {} as Token };
    },
    enabled: isAddress(address) && !!chainId,
  });

  const detailsQuery = useQuery({
    queryKey: ["find/token-details"],
    queryFn: async () => {
      const { token } = query.data!;

      let { logoURI, name, details } = await coingecko.getTokenByContract(
        token.address,
        token.chainId
      );

      return { ...token, name, details, logoURI };
    },
    enabled:
      query.isSuccess &&
      !!query.data.source &&
      query.data.source !== "on-chain",
  });

  return {
    token: detailsQuery.data ?? query.data?.token,
    source: query.data?.source,
    isLoading: detailsQuery.isLoading ?? query.isLoading,
  };
};

export const useDiscoverFromApi = (tokens: Token[]) => {
  const toQuery = tokens.map((t) => `${t.chainId}:${t.address}`);
  const queryString = toQuery.join(",");

  return useQuery({
    enabled: tokens.length > 0,
    placeholderData: [],
    queryKey: ["api/tokens", queryString],
    queryFn: async () => {
      const detailedTokens = await axios.get(
        import.meta.env.VITE_API_URL + "tokens?tokens=" + queryString
      );

      return detailedTokens.data.map((t: any) => {
        const original = tokens
          .filter((token) => {
            return (
              Number(token.chainId) === Number(t.chainId) &&
              token.address.toLowerCase() === t.address.toLowerCase()
            );
          })
          .at(0);
        return { ...original, ...t };
      });
    },
  });
};
