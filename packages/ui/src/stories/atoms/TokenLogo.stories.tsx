import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenLogo } from "../../components/atoms/TokenLogo";
import logo24 from "../../assets/logo-24.svg";

export default {
  title: "Components/Atoms/TokenLogo",
  component: TokenLogo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TokenLogo>;

const Template: ComponentStory<typeof TokenLogo> = (args) => (
  <TokenLogo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  logo: logo24,
};

export const Pair = Template.bind({});
Pair.args = {
  logo: logo24,
  pairLogo: logo24,
};

export const LP = Template.bind({});
LP.args = {
  ...Pair.args,
  even: true,
};
