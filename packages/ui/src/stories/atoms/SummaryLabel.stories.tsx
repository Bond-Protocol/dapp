import { StoryFn, Meta } from "@storybook/react";
import logo from "assets/icons/ethereum.svg";
import { SummaryLabel, Link, Tooltip } from "components";

export default {
  title: "Design System/Atoms/SummaryLabel",
  component: SummaryLabel,
  argTypes: {},
  args: {
    value: "ETH",
  },
} as Meta<typeof SummaryLabel>;

export const Primary = {};

export const Subtext = {
  args: {
    subtext: "BOND TOKEN",
  },
};

export const Icon = {
  args: {
    icon: logo,
  },
};

export const All = {
  args: {
    ...Subtext.args,
    ...Icon.args,
  },
};

export const WithLink = {
  args: {
    ...All.args,
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
};
