//@ts-nocheck
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenLogo } from "../../components/atoms/TokenLogo";
import logo24 from "../../assets/icon-logo.png";

export default {
  title: "Components/Atoms/TokenLogo",
  component: TokenLogo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TokenLogo>;

const Template: ComponentStory<typeof TokenLogo> = (args) => (
  <TokenLogo {...args} />
);

export const Single = Template.bind({});
Single.args = {
  icon: logo24,
};

export const Pair = Template.bind({});
Pair.args = {
  icon: logo24,
  pairIcon: logo24,
};

export const LP = Template.bind({});
LP.args = {
  ...Pair.args,
};
