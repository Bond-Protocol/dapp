import { StoryFn, Meta } from "@storybook/react";
import { ModalDecorator, blockExplorerUrl } from "../decorators";

import { TransactionHashDialog } from "components";

export default {
  title: "Components/Modals/TransactionHash",
  component: TransactionHashDialog,
  decorators: [ModalDecorator],
} as Meta<typeof TransactionHashDialog>;

export const Primary = {
  args: {
    hash: "123",
    blockExplorerName: "etherscan",
    blockExplorerUrl,
  },
};
