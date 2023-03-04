import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";
import { PurchaseConfirmDialog } from "../../components/modals";

import { ModalDecorator } from "../decorators";

export default {
  title: "Screens/Modals/PurchaseConfirm",
  component: PurchaseConfirmDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof PurchaseConfirmDialog> = (args) => (
  <PurchaseConfirmDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  issuer: "OlympusDAO",
  amount: "333,333 DAI",
  payout: "333 GOHM",
  vestingTime: "12 months",
  contract: "0x12312312312312312312312311414",
};
