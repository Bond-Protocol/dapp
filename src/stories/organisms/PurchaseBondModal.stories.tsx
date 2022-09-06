import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BondPurchaseModal } from "../../components/organisms/BondPurchaseModal";

export default {
  title: "Components/Organisms/BondPurchaseModal",
  component: BondPurchaseModal,
} as ComponentMeta<typeof BondPurchaseModal>;

const Template: ComponentStory<typeof BondPurchaseModal> = (args) => (
  <BondPurchaseModal {...args} />
);

const Background = (Story) => (
  <div className="bg-brand-texas-rose h-[100vh]">
    <Story />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  issuer: "AphexProtocol",
};

export const OverElements = Primary;
OverElements.decorators = [Background];
