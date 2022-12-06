import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateMarketConfirmDialog } from "../../components/modals";

import { ModalDecorator, blockExplorerUrl } from "../decorators";

export default {
  title: "Components/Modals/CreateMarketConfirm",
  component: CreateMarketConfirmDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof CreateMarketConfirmDialog>;

const Template: ComponentStory<typeof CreateMarketConfirmDialog> = (args) => (
  <CreateMarketConfirmDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  hash: "420",
  blockExplorerName: "etherscan",
  blockExplorerUrl,
  error: {
    message: "ran out of gas",
  },
};
