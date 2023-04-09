import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ModalDecorator } from "../decorators";

import { MarketCreatedDialog } from "components";

export default {
  title: "Components/Modals/MarketCreated",
  component: MarketCreatedDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof MarketCreatedDialog>;

const Template: ComponentStory<typeof MarketCreatedDialog> = (args) => (
  <MarketCreatedDialog />
);

export const Primary = Template.bind({});

Primary.args = {};
