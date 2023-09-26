import OpenAPIClient from "openapi-axios-client";
import definition from "src/openapi.json";
import { Client as OrderClient } from "src/types/openapi";
const getAccessToken = () => sessionStorage.getItem("order_access_token");
const getRefreshToken = () => sessionStorage.getItem("order_refresh_token");
const setAccessToken = (token: string) =>
  sessionStorage.setItem("order_access_token", token);
const setRefreshToken = (token: string) =>
  sessionStorage.setItem("order_refresh_token", token);

//@ts-ignore
const client = new OpenAPIClient({ definition, strict: true });
client.init<OrderClient>();

export class ApiClient {
  api!: OrderClient;

  constructor() {
    client.getClient<OrderClient>().then((api) => {
      api.interceptors.response.use(
        (res) => res,
        async (err) => {
          const originalConfig = err.config;
          console.log({ originalConfig, err });
          if (
            originalConfig.url !== "/auth/sign_in" &&
            originalConfig.url !== "/auth/refresh" &&
            err.response.status === 401
          ) {
            if (err.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
            }

            const refreshToken = getRefreshToken() ?? "";

            try {
              const response = await api.refreshAuth(null, refreshToken);
              setAccessToken(response.data.access_token!);
              setRefreshToken(response.data.refresh_token!);

              originalConfig.headers.Authorization = `Bearer ${response.data.access_token}`;

              return api(originalConfig);
            } catch (e) {
              originalConfig._retry = false;
              return Promise.reject(e);
            }
          }
        }
      );
      this.api = api;
    });
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
