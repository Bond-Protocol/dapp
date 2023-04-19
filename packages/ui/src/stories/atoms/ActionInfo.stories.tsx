import { StoryObj, Meta } from "@storybook/react";
import { ActionInfo } from "components";

export default {
  title: "Design System/Atoms/ActionInfo",
  component: ActionInfo,
} as Meta<typeof ActionInfo>;

type Story = StoryObj<typeof ActionInfo>;

export const Primary: Story = {
  args: {
    editable: true,
    rightLabel: "24",
    leftLabel: "Rug Intensity",
    symbol: "%",
  },
};
