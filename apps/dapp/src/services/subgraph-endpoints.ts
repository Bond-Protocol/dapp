import { UseQueryResult, useQueries } from "@tanstack/react-query";
import { environment } from "src/environment";
import { Variables } from "graphql-request";
import { queryAllEndpoints } from "src/utils/queryAllEndpoints";
import { mainnetDeployments } from "@bond-protocol/contract-library/src/deployments/mainnets";
import { testnetDeployments } from "@bond-protocol/contract-library/src/deployments/testnets";
import { BondDeployment } from "@bond-protocol/contract-library/src/deployments/types";

function toSubgraphURL(deployment: BondDeployment) {
  return {
    url: deployment.subgraphURL,
    chain: deployment.chain,
  };
}
export const mainnetEndpoints = mainnetDeployments.map(toSubgraphURL);
export const testnetEndpoints = testnetDeployments.map(toSubgraphURL);

export const subgraphEndpoints: Record<number, string> = [
  ...mainnetEndpoints,
  ...testnetEndpoints,
].reduce((record, element) => {
  return { ...record, [element.chain.id]: element.url };
}, {});

export const currentEndpoints = environment.isTesting
  ? testnetEndpoints
  : mainnetEndpoints;

export const getSubgraphQuery = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  chain: string,
  enabled: boolean,
  variables?: {}
): UseQueryResult<any, any> => {
  const endpoint = {
    // @ts-ignore
    url: subgraphEndpoints[chain],
    chain: chain,
  };

  return query(
    {
      endpoint: endpoint.url,
      fetchParams: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
    { queryKey: endpoint.url + "--" + query.name.toString(), ...variables },
    { enabled: enabled }
  );
};

const isTestnet = environment.isTestnet;

export function useGetSubgraphQueries<TQuery>({
  document,
  variables,
}: {
  document: string;
  variables?: Variables;
}) {
  return useQueries({
    queries: queryAllEndpoints<TQuery>({ document, variables }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (response): response is UseQueryResult<TQuery> =>
          response?.data !== undefined
      );
      return {
        queries: filteredResponses,
        isLoading: responses.some((r) => r.isLoading),
      };
    },
  });
}

export const getSubgraphQueriesPerChainFn = (
  query: ({}: any, {}: any, {}: any) => UseQueryResult<any, any>,
  func: (chain: number) => any,
  fieldName: string
): UseQueryResult<any, any>[] => {
  const endpoints = isTestnet ? testnetEndpoints : mainnetEndpoints;

  const queries: UseQueryResult<any, any>[] = [];
  endpoints.forEach((endpoint) => {
    const variables = {
      queryKey: endpoint.url + "--" + query.name.toString(),
    };
    // @ts-ignore
    variables[fieldName] = func(endpoint.chain);

    queries.push(
      query(
        {
          endpoint: endpoint.url,
          fetchParams: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        },
        variables,
        { enabled: isTestnet ? !!isTestnet : !isTestnet }
      )
    );
  });
  return queries;
};
