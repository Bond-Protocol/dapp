import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";
import { PurchaseConfirmDialog } from "../../components/modals/PurchaseConfirmDialog";

export default {
  title: "Components/Modals/PurchaseConfirm",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<any> = ({ title, ...args }) => (
  <Modal title={title} open={true} onClickClose={() => {}}>
    <PurchaseConfirmDialog {...args} />
  </Modal>
);

export const Primary = Template.bind({});

Primary.args = {
  title: "Transaction Confirmation",
  issuer: "Bond Protocol",
  amount: "$333,333",
  payout: "333 GOHM",
  vestingTime: "2022-12-31",
  contract: "0x12312312312312312312312311414",
};
