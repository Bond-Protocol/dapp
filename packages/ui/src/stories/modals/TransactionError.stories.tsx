import { StoryFn, Meta } from "@storybook/react";
import { TransactionErrorDialog } from "components";

import { ModalDecorator, blockExplorerUrl } from "../decorators";

const sampleError = {
  reason: "processing response error",
  code: "SERVER_ERROR",
  body: '{"jsonrpc":"2.0","id":54,"error":{"code":-32601,"message":"the method eth_sendTransaction does not exist/is not available"}}\n',
  error: {
    code: -32601,
  },
  requestBody:
    '{"method":"eth_sendTransaction","params":[{"gas":"0x56f76","from":"0xea8a734db4c7ea50c32b5db8a0cb811707e8ace3","to":"0x007f7a1cb838a872515c8ebd16be4b14ef43a222","data":"0xae4180950000000000000000000000000000000000000000000000000000000000000048"}],"id":54,"jsonrpc":"2.0"}',
  requestMethod: "POST",
  url: "https://arb1.arbitrum.io/rpc",
};

export default {
  title: "Components/Modals/TransactionError",
  component: TransactionErrorDialog,
  decorators: [ModalDecorator],
} as Meta<typeof TransactionErrorDialog>;

export const Primary = {
  args: {
    hash: "420",
    blockExplorerName: "etherscan",
    blockExplorerUrl,
    error: sampleError,
  },
};
