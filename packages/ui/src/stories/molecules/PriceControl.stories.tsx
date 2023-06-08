import { Meta, StoryFn } from "@storybook/react";
import { PriceControl } from "components";

export default {
  title: "Design System/Molecules/PriceControl",
  component: PriceControl,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof PriceControl>;

const token = {
  symbol: "ETH",
  price: "1900",
};

export const Primary = {
  args: {
    topLabel: "Fixed Price",
    bottomLabel: "Initial Discount",
    tooltip: "ya",
    onRateChange: () => {},

    payoutToken: token,
    quoteToken: { symbol: "NGMI", price: 1123100123 },
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

export const LargeText = {
  args: {
    ...Primary.args,
    payoutToken: {
      symbol: "WETH",
      price: "921304102341293491234912934912342",
    },
    quoteToken: { symbol: "ibbtc/sbtcCRV-f", price: 3 },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};
