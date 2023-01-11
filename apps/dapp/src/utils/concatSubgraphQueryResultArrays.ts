import { UseQueryResult } from "react-query";

export const concatSubgraphQueryResultArrays = (
  queries: UseQueryResult<any, any>[],
  fieldName: string
) => {
  return queries
    .filter((value) => !value.isError)
    .map((value) => value.data[fieldName])
    .reduce((previous, current) => previous.concat(current), []);
};
