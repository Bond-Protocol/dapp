import { StoryFn, Meta } from "@storybook/react";
import { Input } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Input",
  component: Input,
  argTypes: {},
} as Meta<typeof Input>;

export const Primary = {
  args: {
    label: "Wen dapp?",
    subText: "Enter seedphrase above",
  },
};

export const WithError = {
  args: {
    ...Primary.args,
    errorMessage: "This is an error",
  },
};
