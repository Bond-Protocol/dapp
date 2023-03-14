import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceControl } from "../../components/molecules/PriceControl";

export default {
  title: "Design System/Molecules/PriceControl",
  component: PriceControl,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PriceControl>;

const Template: ComponentStory<typeof PriceControl> = (args) => (
  <PriceControl {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  topLabel: "Fixed Price",
  exchangeRate: 0.094,
  payoutTokenSymbol: "OHM",
  quoteTokenSymbol: "DAI",
  onRateChange: () => {},
};
