import { StoryObj, Meta, StoryFn } from "@storybook/react";
import { StatusChip } from "components";

export default {
  title: "Design System/Atoms/StatusChip",
  component: StatusChip,
} as Meta<typeof StatusChip>;

export const Primary = {
  args: {
    content: "Closed",
    className: "bg-red-500/70",
  },
};

export const Selected = {
  args: {
    content: "Open",
    className: "bg-green-500/70",
  },
};
