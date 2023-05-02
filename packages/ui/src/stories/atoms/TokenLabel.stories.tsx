import { Meta, StoryFn } from "@storybook/react";
import { TokenLabel } from "components";

export default {
  title: "Design System/Atoms/TokenLabel",
  component: TokenLabel,
  argTypes: {},
} as Meta<typeof TokenLabel>;

export const Primary = {
  args: {
    label: "OHM",
  },
};

export const SubText = {
  args: {
    ...Primary.args,
    secondary: "10012,23",
  },
};

export const Wrapped = {
  args: {
    ...Primary.args,
    wrapped: true,
  },
};
