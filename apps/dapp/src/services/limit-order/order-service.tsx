import { SiweMessage } from "siwe";
import { Address, signMessage } from "@wagmi/core";
import { orderApi as orderClient } from "./api-client";
import { Order } from "src/types/openapi";
import { BigNumber } from "ethers";

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
  token: string;
};

type CreateOrderArgs = BasicOrderArgs & OrderConfig;

const sign = async (
  chainId: number,
  address: string,
  statement = defaultStatement
) => {
  const { data: nonce } = await orderClient.api.getNonce();

  const message = new SiweMessage({
    ...basicMessage,
    statement,
    address,
    chainId,
    nonce,
  }).prepareMessage();

  const signature = await signMessage({ message });

  return { message, signature };
};

const signIn = async (chainId: number, address: string) => {
  try {
    const { message, signature } = await sign(chainId, address);

    return orderClient.api.signIn(null, {
      message,
      signature,
    });
  } catch (e) {
    console.error(`Failed to sign in`, e);
  }
};

const createOrder = async ({ chainId, ...order }: CreateOrderArgs) => {
  const { signature } = await sign(chainId, order.address);

  try {
    const response = await orderClient.api.createOrder(
      null,
      { ...order, signature },
      { headers: orderClient.makeHeaders({ chainId }) }
    );
    return response;
  } catch (e) {
    console.error(`Failed to create an order`, e);
    throw e;
  }
};

const listAllOrders = async ({ chainId, token, address }: BasicOrderArgs) => {
  const response = await orderClient.api.getOrdersByAddress(address, null, {
    headers: orderClient.makeHeaders({ chainId, token }),
  });

  const filters = ["recipient", "referrer", "user"];
  const dates = ["submitted", "deadline"];

  return response.data.map((o) => {
    return Object.entries(o).reduce((acc, [name, value]) => {
      let updated = value;
      if (!filters.includes(name)) {
        updated = BigNumber.from(value).toString();
        if (dates.includes(name)) {
          updated = new Date(Number(updated.toString()));
        }
      }

      return { ...acc, [name]: updated };
    }, {});
  });
};

const listByMarket = async () => {};

const cancelOrder = async () => {};
const cancelAllOrders = async () => {};

export default {
  signIn,
  createOrder,
  listAllOrders,
};
