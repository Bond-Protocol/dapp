import {
  CalculatedMarket,
  getAddresses,
} from "@bond-protocol/contract-library";
import { BigNumber, ethers } from "ethers";
import OpenAPIClient from "openapi-axios-client";
import { SiweMessage } from "siwe";
import definition from "src/openapi.json";
import { Client as OrderClient } from "src/types/openapi";
import { Address, signMessage } from "@wagmi/core";
import { Order } from "src/types/openapi";

const AGGREGATOR_ADDRESS = getAddresses("1").aggregator; //For now all chains share the same address, so no need to desambiguate
const SETTLEMENT_ADDRESS = "0x0000000000000000000000000000000000000001";

export const TokenStorage = {
  getAccessToken: () => sessionStorage.getItem("order_access_token"),
  getRefreshToken: () => sessionStorage.getItem("order_refresh_token"),
  setAccessToken: (token: string) =>
    sessionStorage.setItem("order_access_token", token),
  setRefreshToken: (token: string) =>
    sessionStorage.setItem("order_refresh_token", token),
};

const defaultStatement = "Sign in with Ethereum to the Bond Protocol app.";

const basicMessage = {
  domain: "bondprotocol.finance",
  uri: "https://app.bondprotocol.finance",
  version: "1",
};

export type OrderConfig = Required<Omit<Required<Order>, "submitted">>;

type BasicOrderArgs = {
  chainId: number;
  address: string | Address;
  token?: string;
};

type CreateOrderArgs = BasicOrderArgs & OrderConfig;

//@ts-ignore
const client = new OpenAPIClient({ definition, strict: true });
client.init<OrderClient>();

type NewType = BasicOrderArgs;

export class ApiClient {
  api!: OrderClient;

  constructor() {
    client.getClient<OrderClient>().then((api) => {
      //Setup an interceptor to attempt a token refresh on a 401
      api.interceptors.response.use((res) => res, refreshTokenInterceptor(api));
      this.api = api;
    });
  }

  async signIn(chainId: number, address: string) {
    try {
      const { message, signature } = await this.sign(chainId, address);

      return this.api.signIn(null, {
        message,
        signature,
      });
    } catch (e) {
      console.error(`Failed to sign in`, e);
    }
  }

  async createOrder({ chainId, ...order }: CreateOrderArgs) {
    const { signature } = await this.sign(chainId, order.address);

    try {
      const response = await this.api.createOrder(
        null,
        { ...order, signature },
        { headers: this.makeHeaders({ chainId }) }
      );
      console.log({ response });
      return response;
    } catch (e: any) {
      console.error(`Failed to create an order`, e);
      throw e;
    }
  }

  async listAllOrders({
    chainId,
    token,
    address,
    market,
  }: NewType & { market: CalculatedMarket }) {
    const response = await this.api.getOrdersByAddress(address, null, {
      headers: this.makeHeaders({ chainId, token }),
    });

    const filters = ["market_id", "status", "recipient", "referrer", "user"];
    const dates = ["submitted", "deadline"];

    //Most values come as 256 bit hex-encoded number,
    //so we want to convert them to human readable
    return response.data.map((o) => {
      return Object.entries(o).reduce((acc, [name, value]) => {
        let updated = value;

        if (!filters.includes(name)) {
          updated = BigNumber.from(value).toString();

          if (dates.includes(name)) {
            //Timestamps get converted to dates
            updated = new Date(Number(updated.toString()));
          }

          //Tokens need to be decimal adjusted
          if (name === "amount") {
            updated = ethers.utils.formatUnits(
              updated,
              market.quoteToken.decimals
            );
          }

          if (name === "min_amount_out") {
            updated = ethers.utils.formatUnits(
              updated,
              market.payoutToken.decimals
            );
          }
        }

        return { ...acc, [name]: updated };
      }, {});
    });
  }

  async cancelAllOrders({
    chainId,
    marketId,
    address,
    token,
  }: {
    chainId: number;
    marketId: string;
    address: string;
    token: string;
  }) {
    //@ts-ignore
    const response = await this.api.cancelOrder(
      //@ts-ignore
      { address, market_id: Number(marketId) },
      null,
      { headers: this.makeHeaders({ chainId, token }) }
    );
    return response;
  }

  async getSupportedTokens() {
    return this.api.getSupportedQuoteTokens(null, null, {
      headers: this.makeHeaders({ chainId: 1 }),
    });
  }

  async getSupportedTokensByChain(chainId: number) {
    return this.api.getSupportedQuoteTokens(null, null, {
      headers: this.makeHeaders({ chainId }),
    });
  }

  async cancelOrder({
    chainId,
    address,
    digest,
    token,
  }: {
    chainId: number;
    address: string;
    digest: string;
    token: string;
  }) {
    const response = await this.api.cancelOrderByDigest(
      //@ts-ignore
      { address, digest: BigNumber.from(digest).toHexString() },
      null,
      { headers: this.makeHeaders({ chainId, token }) }
    );
    return response;
  }

  async estimateFee(chainId: number, order: Order) {
    return this.api.estimateFee(null, order, {
      headers: {
        ...this.makeHeaders({ chainId }),
        "Content-Type": "application/json",
      },
    });
  }

  private makeHeaders({
    token,
    chainId,
    aggregator = AGGREGATOR_ADDRESS,
    settlement = SETTLEMENT_ADDRESS,
  }: {
    chainId: number;
    token?: string;
    aggregator?: string;
    settlement?: string;
  }) {
    const headers: Record<string, string | number> = {
      "x-chain-id": chainId,
      "x-aggregator": aggregator,
      "x-settlement": settlement,
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
  }

  private async sign(
    chainId: number,
    address: string,
    statement = defaultStatement
  ) {
    const { data: nonce } = await this.api.getNonce();

    const message = new SiweMessage({
      ...basicMessage,
      statement,
      address,
      chainId,
      nonce,
    }).prepareMessage();

    const signature = await signMessage({ message });

    return { message, signature };
  }
}

//Error interceptor that attempts to refresh a JWT token
function refreshTokenInterceptor(api: OrderClient) {
  return async (err: any) => {
    const originalConfig = err.config;
    if (
      originalConfig.url !== "/auth/sign_in" &&
      originalConfig.url !== "/auth/refresh" &&
      err.response.status === 401
    ) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
      }

      const refreshToken = TokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const response = await api.refreshAuth(null, refreshToken);
          TokenStorage.setAccessToken(response.data.access_token!);
          TokenStorage.setRefreshToken(response.data.refresh_token!);

          originalConfig.headers.Authorization = `Bearer ${response.data.access_token}`;

          return api(originalConfig);
        } catch (e) {
          originalConfig._retry = false;
          return Promise.reject(e);
        }
      }
    } else {
      throw err;
    }
  };
}

export const orderService = new ApiClient();
