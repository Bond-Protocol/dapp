import { SiweMessage } from "siwe";
import { Address, signMessage } from "@wagmi/core";
import { orderApi as orderClient } from "./api-client";
import { Order } from "src/types/openapi";
import { BigNumber, ethers } from "ethers";
import { CalculatedMarket } from "@bond-protocol/contract-library";

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
    console.log({ response });
    return response;
  } catch (e: any) {
    console.error(`Failed to create an order`, e);
    throw e;
  }
};

const listAllOrders = async ({
  chainId,
  token,
  address,
  market,
}: BasicOrderArgs & { market: CalculatedMarket }) => {
  const response = await orderClient.api.getOrdersByAddress(address, null, {
    headers: orderClient.makeHeaders({ chainId, token }),
  });

  const filters = ["market_id", "status", "recipient", "referrer", "user"];
  const dates = ["submitted", "deadline"];

  //Most values come as 255 bit hex-encoded number,
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
};

const cancelOrder = async ({
  chainId,
  address,
  digest,
  token,
}: {
  chainId: number;
  address: string;
  digest: string;
  token: string;
}) => {
  const response = await orderClient.api.cancelOrderByDigest(
    //@ts-ignore
    {
      address,
      digest: BigNumber.from(digest).toHexString(),
    },
    null,
    { headers: orderClient.makeHeaders({ chainId, token }) }
  );
  return response;
};

const cancelAllOrders = async ({
  chainId,
  marketId,
  address,
  token,
}: {
  chainId: number;
  marketId: string;
  address: string;
  token: string;
}) => {
  //@ts-ignore
  const response = await orderClient.api.cancelOrder(
    //@ts-ignore
    { address, market_id: Number(marketId) },
    null,
    { headers: orderClient.makeHeaders({ chainId, token }) }
  );
  return response;
};

const getSupportedTokens = async () => {
  return orderClient.api.getSupportedQuoteTokens(null, null, {
    headers: orderClient.makeHeaders({ chainId: 1 }),
  });
};

export default {
  signIn,
  createOrder,
  cancelOrder,
  cancelAllOrders,
  listAllOrders,
  getSupportedTokens,
};
