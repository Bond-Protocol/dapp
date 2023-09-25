import OpenAPIClient from "openapi-axios-client";
import definition from "src/openapi.json";
import { Client as OrderClient } from "src/types/openapi";

//@ts-ignore
const client = new OpenAPIClient({ definition, strict: true });
client.init<OrderClient>();

export class ApiClient {
  api!: OrderClient;

  constructor() {
    client.getClient<OrderClient>().then((api) => (this.api = api));
  }

  makeHeaders({
    token,
    chainId,
    aggregator = "0x0000000000000000000000000000000000000001",
    settlement = "0x0000000000000000000000000000000000000001",
    isPost,
  }: {
    chainId: number;
    token?: string;
    aggregator?: string;
    settlement?: string;
    isPost?: boolean;
  }) {
    const headers: Record<string, string | number> = {
      "x-chain-id": chainId,
      "x-aggregator": aggregator,
      "x-settlement": settlement,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;

    //return { headers };
  }
}

export const orderApi = new ApiClient();
