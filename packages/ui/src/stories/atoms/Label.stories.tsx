//@ts-nocheck
import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Label } from "../../components/atoms/Label";
import logo from "../../assets/icon-logo.png";
import { Link, Tooltip } from "../../components/atoms";

export default {
  title: "Components/Atoms/Label",
  component: Label,
  argTypes: {},
  args: {
    value: "Label",
    icon: logo,
  },
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Primary = Template.bind({});

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  children: (
    <Tooltip content="1) What" iconWidth={13.3} iconClassname="pb-0.5 ml-1" />
  ),
};

export const WithLink = Template.bind({});
WithLink.args = {
  children: <Link href="" iconClassName="ml-1.5" />,
};
