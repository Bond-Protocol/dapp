import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BondPurchaseModal } from "../../components/modals/BondPurchaseModal";
import { RouterDecorator } from "../decorators";

export default {
  title: "Components/Organisms/BondPurchaseModal",
  component: BondPurchaseModal,
  decorators: [RouterDecorator],
} as ComponentMeta<typeof BondPurchaseModal>;

const Template: ComponentStory<typeof BondPurchaseModal> = (args) => (
  <BondPurchaseModal {...args} />
);

const Background = (Story) => (
  <div className="h-[100vh] bg-brand-texas-rose">
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
