import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ActionInfo } from "../../components/atoms/ActionInfo";
import logo from "../../assets/icon-logo.png";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/ActionInfo",
  component: ActionInfo,
  argTypes: {},
  args: {
    leftLabel: "Label",
    rightLabel: "Label",
  },
} as ComponentMeta<typeof ActionInfo>;

const Template: ComponentStory<typeof ActionInfo> = (args) => (
  <ActionInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  tooltip: "im a tooltip",
  link: "null",
};
