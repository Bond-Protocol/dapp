import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BondPurchaseCard } from "../components/organisms/BondPurchaseCard";
import logo from "../assets/icons/eth-icon.svg";

export default {
  title: "Components/Organisms/BondPurchaseCard",
  component: BondPurchaseCard,
} as ComponentMeta<typeof BondPurchaseCard>;

const Template: ComponentStory<typeof BondPurchaseCard> = (args) => (
  <BondPurchaseCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  payoutToken: { symbol: "OHM", id: "33", logo },
  quoteToken: { symbol: "DAI", id: "2", logo },
  userBalance: "1000",
};
