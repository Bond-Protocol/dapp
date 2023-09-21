import OpenAPIClient from "openapi-axios-client";
import definition from "src/openapi.json";
import { Order, Client as OrderClient } from "src/types/openapi";

//@ts-ignore
const client = new OpenAPIClient({ definition, strict: true });
client.init<OrderClient>();

export class ApiClient {
  private api!: OrderClient;

  constructor() {
    client.getClient<OrderClient>().then((api) => (this.api = api));
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
    return this.api.signIn(null, { message, signature });
  }

  async testToken({
    address,
    chainId,
    token,
  }: {
    address: string;
    chainId: number;
    token: string;
  }) {
    return this.api.testAuth(
      { address },
      null,
      this.makeHeaders({ token, chainId })
    );
  }

  async createOrder({
    order,
    chainId,
  }: {
    chainId: number;
    order: Required<Order>;
  }) {
    return this.api.createOrder(
      null,
      order,
      this.makeHeaders({ chainId, isPost: true })
    );
  }

  async listByAddress({
    chainId,
    address,
    token,
  }: {
    chainId: number;
    token: string;
    address: string;
  }) {
    return this.api.getOrdersByAddress(
      { account_address: address },
      null,
      this.makeHeaders({ chainId, token })
    );
  }

  private makeHeaders({
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
    const _chainId = chainId.toString();

    const headers: Record<string, string> = {
      "X-Chain-Id": _chainId,
      "X-Aggregator": aggregator,
      "X-Settlement": settlement,
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (isPost) headers["Content-Type"] = "application/json";

    return { headers };
  }
}

export const orderApi = new ApiClient();
