import { Meta, StoryFn } from "@storybook/react";
import { Select } from "components";
import baseLogo from "assets/logo-24.svg";

export default {
  title: "Design System/Atoms/Select",
  component: Select,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof Select>;

const tokenOptions = [
  { logo: baseLogo, symbol: "BTC", id: "1" },
  { logo: baseLogo, symbol: "DAI", id: "2" },
  { logo: baseLogo, symbol: "OHM", id: "33" },
  { logo: baseLogo, symbol: "ETH", id: "3" },
  { logo: baseLogo, symbol: "veBPT", id: "4" },
];

export const options = tokenOptions.map((t) => ({ ...t, label: t.symbol }));

export const Primary = {
  args: {
    options: options,
  },
};
