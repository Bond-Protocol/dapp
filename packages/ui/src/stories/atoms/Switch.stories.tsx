import { Meta, StoryFn } from "@storybook/react";
import { Switch } from "components";

export default {
  title: "Design System/Atoms/Switch",
  component: Switch,
} as Meta<typeof Switch>;

export const Primary = {};

export const Label = {
  args: {
    label: "Wagmi",
  },
};
