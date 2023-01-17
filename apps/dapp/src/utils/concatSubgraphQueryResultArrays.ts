import { UseQueryResult } from "react-query";

export const concatSubgraphQueryResultArrays = (
  queries: UseQueryResult<any, any>[],
  fieldName: string
) => {
  return queries
    .filter((value, index, self) => {
      return !value.isError
        && (index === self.findIndex((v) =>
          JSON.stringify(v.data) === JSON.stringify(value.data)))
    })
    .map((value) => value.data[fieldName])
    .reduce((previous, current) => previous.concat(current), []);
};
