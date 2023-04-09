import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal, PurchaseSuccessDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/PurchaseSuccess",
  component: PurchaseSuccessDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof PurchaseSuccessDialog> = (args) => (
  <PurchaseSuccessDialog {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  issuer: "OlympusDAO",
};
