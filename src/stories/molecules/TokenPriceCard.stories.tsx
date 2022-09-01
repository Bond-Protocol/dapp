import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TokenPriceCard } from "../../components/atoms/TokenPriceCard";

export default {
  title: "Components/Atoms/TokenPriceCard",
  component: TokenPriceCard,
} as ComponentMeta<typeof TokenPriceCard>;

const Template: ComponentStory<typeof TokenPriceCard> = (args) => (
  <TokenPriceCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  symbol: "OHM",
  decimals: "18",
};
