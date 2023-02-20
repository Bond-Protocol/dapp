import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon } from "../../components/atoms/Icon";

import discord from "../../assets/icons/socials/discord.svg";
import telegram from "../../assets/icons/socials/telegram.svg";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/Icon",
  component: Icon,
  argTypes: {},
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

//@ts-ignore
const Tests: ComponentStory<typeof Icon> = ({ first, second, ...args }) => (
  <>
    <Icon src={first} {...args} />
    <Icon src={second} {...args} />
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  src: discord,
  className: "text-red-500 fill-red-500",
};

export const Secondary = Tests.bind({});
Secondary.args = {
  first: discord,
  second: telegram,
  className: "text-red-500 fill-red-500",
};
