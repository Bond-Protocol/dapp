import { StoryFn, Meta } from "@storybook/react";
import { TransactionErrorDialog } from "components";

import { ModalDecorator, blockExplorerUrl } from "../decorators";

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
  },
};
