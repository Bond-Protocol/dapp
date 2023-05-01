import { StoryFn, Meta } from "@storybook/react";
import { ModalDecorator } from "../decorators";

import { MarketCreatedDialog } from "components";

export default {
  title: "Components/Modals/MarketCreated",
  component: MarketCreatedDialog,
  decorators: [ModalDecorator],
} as Meta<typeof MarketCreatedDialog>;

const Template: StoryFn<typeof MarketCreatedDialog> = (args) => (
  <MarketCreatedDialog />
);

export const Primary = {
  render: Template,
  args: {},
};
