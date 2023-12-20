import { useState } from "react";
import { Token } from "types";
import defillama from "services/defillama";
import coingecko from "services/coingecko";
import axios from "axios";
import { Address, getContract } from "viem";
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

export const useDiscoverToken = () => {
  const [isLoading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  const discover = async (
    address: Address,
    chainId: number
  ): Promise<{ token: Token; source: string }> => {
    setLoading(true);

    try {
      const [token] = await defillama.fetchPrice(address, chainId);
      //@ts-ignore
      if (token?.price) {
        //@ts-ignore
        return { token, source: "defillama" };
      }

      const onChainToken = await fetchOnChain(address, chainId, publicClient);

      if (onChainToken.decimals) {
        //@ts-ignore
        return { token: onChainToken, source: "on-chain" };
      }
    } catch (e) {
      console.error(
        `Failed to discover token ${address} on chain ${chainId}`,
        e
      );
      return { source: "", token: {} as Token };
    } finally {
      setLoading(false);
    }
    return { source: "", token: {} as Token };
  };

  const discoverLogo = async (token: Token) => {
    try {
      let { logoURI, name, details } = await coingecko.getTokenByContract(
        token.address,
        token.chainId
      );

      return { ...token, name, details, logoURI, logoUrl: logoURI };
    } catch (e) {
      console.log(`Failed to discover ${token.symbol} logo`);
      return token;
    }
  };

  return {
    discover,
    discoverLogo,
    isLoading,
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
