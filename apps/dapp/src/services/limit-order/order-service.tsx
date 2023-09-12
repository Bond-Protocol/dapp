import { environment } from "src/environment";
import { SiweMessage } from "siwe";
import { signMessage, signTypedData } from "@wagmi/core";
import { orderApi } from "./api-client";

const messageSettings = {
  statement: "Sign in with Ethereum to the Bond Protocol app.",
  domain: "bondprotocol.finance",
  uri: "https://bondprotocol.finance",
  version: "1",
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

const testAuth = async (chainId: number, address: string) => {};

export default {
  signIn,
};
