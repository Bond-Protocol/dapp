import { StoryObj, Meta, StoryFn } from "@storybook/react";
import { PriceModelDetails } from "components";

export default {
  title: "Design System/Molecules/PriceModelDetails",
  component: PriceModelDetails,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PriceModelDetails>;

export const Primary = {
  args: {},
};

export const Oracle = {
  args: {
    oracle: true,
    type: "dynamic",
    onOracleChange: () => {},
  },
};
