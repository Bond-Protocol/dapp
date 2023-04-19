import { StoryFn, Meta } from "@storybook/react";
import { CreateMarketTermsDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/CreateMarketTerms",
  component: CreateMarketTermsDialog,
  decorators: [ModalDecorator],
} as Meta<typeof CreateMarketTermsDialog>;

export const Primary = {
  args: {},
};
