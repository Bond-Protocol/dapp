import { Meta, StoryFn } from "@storybook/react";
import { ActionCard } from "components";

export default {
  title: "Design System/Molecules/ActionCard",
  component: ActionCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof ActionCard>;

export const Primary = {
  args: {
    title: "Wagmi?",
    leftLabel: "LESGOOOO",
    rightLabel: "Fat nope-Nope",
    onClickRight: () => {},
  },
};
