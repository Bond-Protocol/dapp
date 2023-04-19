import { StoryFn, Meta } from "@storybook/react";
import { Modal, PurchaseSuccessDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/PurchaseSuccess",
  component: PurchaseSuccessDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {
    issuer: "OlympusDAO",
  },
};
