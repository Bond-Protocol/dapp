import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TransactionHashDialog } from "../../components/modals";

import { ModalDecorator, blockExplorerUrl } from "../decorators";

export default {
  title: "Components/Modals/TransactionHash",
  component: TransactionHashDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof TransactionHashDialog>;

const Template: ComponentStory<typeof TransactionHashDialog> = (args) => (
  <TransactionHashDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  hash: "123",
  blockExplorerName: "etherscan",
  blockExplorerUrl,
};
