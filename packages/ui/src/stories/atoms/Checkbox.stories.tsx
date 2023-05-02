import { Meta, StoryFn } from "@storybook/react";
import { Checkbox } from "components";

export default {
  title: "Design System/Atoms/Checkbox",
  component: Checkbox,
} as Meta<typeof Checkbox>;

export const Primary = {
  args: {
    startChecked: true,
  },
};
