import { Meta, StoryFn } from "@storybook/react";
import { PriceControl } from "components";

export default {
  title: "Design System/Molecules/PriceControl",
  component: PriceControl,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PriceControl>;

export const Primary = {
  args: {
    topLabel: "Fixed Price",
    bottomLabel: "Initial Discount",
    tooltip: "ya",
    exchangeRate: 0.256,
    onRateChange: () => {},
  },
};

export const Percentage = {
  args: {
    ...Primary.args,
    percentage: true,
    bottomLabel: "Initial Discount",
    topLabel: "From Oracle Price",
  },
};
