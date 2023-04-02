import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PriceControl } from "components";

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
  tooltip: "ya",
  exchangeRate: 0.256,
  onRateChange: () => {},
};

export const Percentage = Template.bind({});
Percentage.args = {
  ...Primary.args,
  percentage: true,
  bottomLabel: "Initial Discount",
  topLabel: "From Oracle Price",
};
