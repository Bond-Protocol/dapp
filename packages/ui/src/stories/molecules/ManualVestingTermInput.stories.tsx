import { Meta, StoryFn } from "@storybook/react";
import { ManualVestingTermInput } from "components";

export default {
  title: "Design System/Molecules/ManualVestingTermInput",
  component: ManualVestingTermInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    onChange: (onChangeArgs) => {
      console.log({ onChangeargs: onChangeArgs });
    },
  },
} as Meta<typeof ManualVestingTermInput>;

export const Primary = {
  args: {},
};

export const Warning = {
  args: {
    defaultValue: "80",
  },
};

export const Error = {
  args: {
    limit: 270,
    defaultValue: "420",
  },
};
