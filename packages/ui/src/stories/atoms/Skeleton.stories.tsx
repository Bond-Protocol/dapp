import { StoryFn, Meta } from "@storybook/react";
import { Skeleton } from "components/atoms/Skeleton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Skeleton",
  component: Skeleton,
  argTypes: {},
} as Meta<typeof Skeleton>;

export const Primary = {};
