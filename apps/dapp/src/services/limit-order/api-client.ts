import OpenAPIClient from "openapi-axios-client";
import definition from "src/openapi.json";
import type { Client as OrderClient } from "src/types/openapi";

export class ApiClient {
  private client: OpenAPIClient;
  private api!: OrderClient;

  constructor() {
    //@ts-ignore
    this.client = new OpenAPIClient({ definition, strict: true });
    this.client.init<OrderClient>();

    this.client.getClient<OrderClient>().then((api) => {
      this.api = api;
    });
  }

  async init() {
    this.api = await this.client.getClient<OrderClient>();
  }

  async getAuthNonce() {
    const { data: nonce } = await this.api.getNonce();
    return nonce;
  }

  async signIn({
    message,
    signature,
    chainId,
  }: {
    message: string;
    signature: string;
    chainId: number;
  }) {
    return this.api.signIn(
      undefined,
      { message, signature },
      this.makeHeaders({ chainId, isPost: true })
    );
  }

  async testToken({ address, chainId }: { address: string; chainId: number }) {
    return this.api.testAuth({});
  }

  private makeHeaders({
    token,
    chainId,
    aggregator = "",
    settlement = "",
    isPost,
  }: {
    chainId: number;
    token?: string;
    aggregator?: string;
    settlement?: string;
    isPost?: boolean;
  }) {
    const headers: Record<string, string> = {
      "x-chain-id": chainId.toString(),
      "x-aggregator": aggregator,
      "x-settlement": settlement,
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (isPost) headers["Content-Type"] = "application/json";

    return { headers };
  }
}

export const orderApi = new ApiClient();
