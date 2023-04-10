import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateMarketConfirmDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/CreateMarketConfirm",
  component: CreateMarketConfirmDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof CreateMarketConfirmDialog>;

const Template: ComponentStory<typeof CreateMarketConfirmDialog> = (args) => (
  <CreateMarketConfirmDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
