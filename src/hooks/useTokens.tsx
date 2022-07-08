import {getSubgraphEndpoints} from "services/subgraph-endpoints";
import {Token, useListTokensGoerliQuery, useListTokensRinkebyQuery,} from "../generated/graphql";
import {useEffect, useState} from "react";

export function useTokens() {
  const endpoints = getSubgraphEndpoints();

  const [mainnet, setMainnet] = useState<Token[]>([]);
  const [testnet, setTestnet] = useState<Token[]>([]);

  const { data: rinkebyData } = useListTokensRinkebyQuery({
    endpoint: endpoints[0],
  });

  const { data: goerliData } = useListTokensGoerliQuery({
    endpoint: endpoints[1],
  });

  useEffect(() => {
    if (rinkebyData && rinkebyData.tokens && goerliData && goerliData.tokens) {
      const allMarkets = rinkebyData.tokens.concat(goerliData.tokens);
      // @ts-ignore
      setTestnet(allMarkets);
    }
  }, [rinkebyData, goerliData]);

  return {
    mainnet: mainnet,
    testnet: testnet,
  };
}
