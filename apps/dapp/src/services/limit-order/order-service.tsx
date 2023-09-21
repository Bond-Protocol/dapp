import { environment } from "src/environment";
import { SiweMessage } from "siwe";
import { Address, signMessage, signTypedData } from "@wagmi/core";
import { orderApi } from "./api-client";
import { Order } from "src/types/openapi";

const messageSettings = {
  statement: "Sign in with Ethereum to the Bond Protocol app.",
  domain: "bondprotocol.finance",
  uri: "https://bondprotocol.finance",
  version: "1",
};

export type OrderConfig = Required<Omit<Required<Order>, "submitted">>;

type BasicOrderArgs = {
  chainId: number;
  address: string | Address;
  token: string;
};

type CreateOrderArgs = BasicOrderArgs & OrderConfig;

const generateOrder = (order: OrderConfig): Required<Order> => {
  return {
    ...order,
    submitted: Date.now().toString(),
  };
};

const signIn = async (
  chainId: number,
  address: string //: Promise<{ data: { access_token: string; refresh_token: string} }>
) => {
  try {
    const nonce = await orderApi.getAuthNonce();

    const message = new SiweMessage({
      ...messageSettings,
      address,
      chainId,
      nonce,
    }).prepareMessage();

    const signature = await signMessage({ message });

    return orderApi.signIn({
      message,
      signature,
      chainId,
    });
  } catch (e) {
    console.error(`Failed to sign in`, e);
  }
};

const createOrder = async ({
  chainId,
  address,
  token,
  ...rest
}: CreateOrderArgs) => {
  //const test = await orderApi.testToken({ chainId, address, token });
  //console.log({ test });

  const result = await orderApi.createOrder({
    chainId,
    order: generateOrder(rest),
  });
};

const listAllOrders = async ({ chainId, token, address }: BasicOrderArgs) => {
  const orders = await orderApi.listByAddress({ chainId, address, token });
  console.log({ orders });
};

const listByMarket = async () => {};

const cancelOrder = async () => {};
const cancelAllOrders = async () => {};

export default {
  signIn,
  createOrder,
  listAllOrders,
};
