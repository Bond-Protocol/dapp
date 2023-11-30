import {
  request as graphqlRequest,
  RequestDocument,
  Variables,
} from "graphql-request";
import { DocumentNode } from "graphql";

type TypedDocumentNode<
  Result = Record<string, unknown>,
  Variables = Record<string, unknown>
> = DocumentNode;

export async function request<TDocument = any>(
  endpoint: string,
  document: RequestDocument | TypedDocumentNode<TDocument, any>,
  variables?: Variables
) {
  const response = await graphqlRequest<TDocument, Variables>(
    endpoint,
    document,
    variables,
    {
      "Content-Type": "application/json",
    }
  ).catch((e) => {
    return undefined;
  });

  return response;
}
