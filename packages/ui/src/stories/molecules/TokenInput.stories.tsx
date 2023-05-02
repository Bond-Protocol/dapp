import { Meta, StoryFn } from "@storybook/react";
import { TokenInput } from "components";
import baseIcon from "assets/logo-24.svg";

export default {
  title: "Design System/Molecules/TokenInput",
  component: TokenInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof TokenInput>;

export const Primary = {
  args: {
    symbol: "OHM",
    logo: baseIcon,
  },
};
