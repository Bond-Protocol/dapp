import { StoryFn, Meta } from "@storybook/react";
import { CreateMarketConfirmDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/CreateMarketConfirm",
  component: CreateMarketConfirmDialog,
  decorators: [ModalDecorator],
} as Meta<typeof CreateMarketConfirmDialog>;

export const Primary = {
  args: {},
};
