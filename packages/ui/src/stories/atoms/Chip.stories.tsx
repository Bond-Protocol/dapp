import { StoryObj, Meta, StoryFn } from "@storybook/react";
import { Chip } from "components";

export default {
  title: "Design System/Atoms/Chip",
  component: Chip,
} as Meta<typeof Chip>;

export const Primary = {
  args: {
    children: "7D",
  },
};

export const Selected = {
  args: {
    selected: true,
    children: "30D",
  },
};

export const Multiple: StoryObj<typeof Chip> = {
  render: (args) => (
    <div className="flex gap-x-1">
      <Chip {...args} />
      <Chip {...args} selected />
      <Chip {...args} />
      <Chip {...args} />
    </div>
  ),

  args: {
    children: "33D",
  },
};
