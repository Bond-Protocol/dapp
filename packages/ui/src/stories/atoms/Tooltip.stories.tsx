import { StoryFn, Meta } from "@storybook/react";
import { Tooltip } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Tooltip",
  component: Tooltip,
  argTypes: {},
} as Meta<typeof Tooltip>;

export const Primary = {
  args: {
    content: "hai im tooltip",
    iconClassname: "fill-light-secondary-10",
  },
};
