import { StoryFn, Meta } from "@storybook/react";
import { Tabs } from "components";

export default {
  title: "Design System/Molecules/Tabs",
  component: Tabs,
  argTypes: {},
} as Meta<typeof Tabs>;

export const Primary = {
  args: {
    tabs: [
      { value: 1, label: "My Bonds", handleClick: () => {} },
      { label: "My Auctions", handleClick: () => {} },
      { label: "My Markets", handleClick: () => {} },
    ],
    value: 1,
  },
};
