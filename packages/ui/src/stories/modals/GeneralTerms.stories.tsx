import { StoryFn, Meta } from "@storybook/react";
import { GeneralTermsDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/GeneralTerms",
  component: GeneralTermsDialog,
  decorators: [ModalDecorator],
} as Meta<typeof GeneralTermsDialog>;

export const Primary = {};
