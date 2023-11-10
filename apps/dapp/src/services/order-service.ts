import { CalculatedMarket } from "types";
import OpenAPIClient from "openapi-axios-client";
import { SiweMessage } from "siwe";
import definition from "src/openapi.json";
import { Client as LimitOrderApiClient } from "src/types/openapi";
import { Address, signMessage, signTypedData } from "@wagmi/core";
import { Order } from "src/types/openapi";
import { orderApiServerMap } from "src/config";
import { environment } from "src/environment";
import { getAddresses } from "@bond-protocol/contract-library";
import { formatUnits } from "viem";

//SETUP API SERVER BASED ON ENVIRONMENT
const server = orderApiServerMap[environment.current];
definition.servers = [server];

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
  domain: window.location.host,
  uri: window.location.origin,
  version: "1",
};

export type OrderConfig = Order;
export type OrderRequest = Required<Omit<Order, "signature">>;

type BasicOrderArgs = {
  chainId: number;
  address: string | Address;
  token?: string;
};

type CreateOrderArgs = BasicOrderArgs & OrderConfig;

//@ts-ignore
const client = new OpenAPIClient({ definition, strict: true });
client.init<LimitOrderApiClient>();

export class ApiClient {
  api!: LimitOrderApiClient;

  constructor() {
    client.getClient<LimitOrderApiClient>().then((api) => {
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

  async signOrder(order: Order, chainId: number) {
    const domain = {
      name: "Bond Protocol Limit Orders",
      version: "v1.0.0",
      chainId,
      verifyingContract: getAddresses(chainId).settlement,
    } as const;

    const types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Order: [
        { name: "marketId", type: "uint256" },
        { name: "recipient", type: "address" },
        { name: "referrer", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "minAmountOut", type: "uint256" },
        { name: "maxFee", type: "uint256" },
        { name: "submitted", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "user", type: "address" },
      ],
    };
    const value = {
      marketId: Number(order.market_id),
      recipient: order.recipient,
      referrer: order.referrer,
      amount: order.amount,
      minAmountOut: order.min_amount_out,
      maxFee: order.max_fee,
      submitted: order.submitted,
      deadline: order.deadline,
      user: order.user,
    };
    return signTypedData({
      //@ts-ignore
      domain,
      types,
      value,
    });
  }

  async createOrder({
    chainId,
    signature,
    ...order
  }: CreateOrderArgs & { signature: any }) {
    try {
      const response = await this.api.createOrder(
        null,
        { ...order, signature },
        { headers: this.makeHeaders({ chainId }) }
      );
      return response;
    } catch (e: any) {
      console.error(`Failed to create an order`, e);
      throw e;
    }
  }

  parseOrder(order: Order, market: CalculatedMarket) {
    const fields = ["amount", "filled", "max_fee", "min_amount_out", "price"];
    const dates = ["submitted", "deadline"];

    return Object.entries(order).reduce((acc, [name, value]) => {
      let updated = value;

      if (dates.includes(name)) {
        //Timestamps get converted to dates
        updated = new Date(Number(updated.toString()));
      }

      if (fields.includes(name)) {
        updated = BigInt(value).toString();
        //Tokens need to be decimal adjusted
        if (name === "amount") {
          updated = formatUnits(updated, market.quoteToken.decimals);
        }

        if (name === "min_amount_out") {
          updated = formatUnits(updated, market.payoutToken.decimals);
        }
      }

      return { ...acc, [name]: updated };
    }, {});
  }

  async listAllOrders({ chainId, token, address }: BasicOrderArgs) {
    const response = await this.api.getOrdersByAddress(address, null, {
      headers: this.makeHeaders({ chainId, token }),
    });

    //Most values come as 256 bit hex-encoded number,
    //so we want to convert them to human readable
    return response.data;
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
    const response = await this.api.cancelAllOrdersByMarket(
      //@ts-ignore
      { address, market_id: Number(marketId) },
      null,
      { headers: this.makeHeaders({ chainId, token }) }
    );
    return response;
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

  async estimateFee(chainId: number, marketId: number) {
    return this.api.estimateFee(
      //@ts-ignore
      { market_id: marketId },
      null,
      { headers: this.makeHeaders({ chainId }) }
    );
  }

  private makeHeaders({ token, chainId }: { chainId: number; token?: string }) {
    const chainAddresses = getAddresses(chainId);
    const headers: Record<string, undefined | string | number | Address> = {
      "x-chain-id": chainId,
      "x-aggregator": chainAddresses.aggregator,
      "x-settlement": chainAddresses.settlement,
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
function refreshTokenInterceptor(api: LimitOrderApiClient) {
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
          const response = await api.refreshAuth(null, refreshToken, {
            headers: {
              "Content-Type": "application/json",
            },
          });
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
