import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TransactionErrorDialog } from "../../components/modals";

import { ModalDecorator, blockExplorerUrl } from "../decorators";

export default {
  title: "Screens/Modals/TransactionError",
  component: TransactionErrorDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof TransactionErrorDialog>;

const Template: ComponentStory<typeof TransactionErrorDialog> = (args) => (
  <TransactionErrorDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  hash: "420",
  blockExplorerName: "etherscan",
  blockExplorerUrl,
};
