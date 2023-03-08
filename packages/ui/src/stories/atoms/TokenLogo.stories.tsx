import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenLogo } from "../../components/atoms/TokenLogo";
import logo24 from "../../assets/logo-24.svg";

const usdcLogo =
  "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/USDC.png";

export default {
  title: "Design System/Atoms/TokenLogo",
  component: TokenLogo,
} as ComponentMeta<typeof TokenLogo>;

const Template: ComponentStory<typeof TokenLogo> = (args) => (
  <TokenLogo {...args} />
);

export const Single = Template.bind({});
Single.args = {
  icon: logo24,
};

export const Bond = Template.bind({});
Bond.args = {
  icon: usdcLogo,
  pairIcon: logo24,
};

export const LPBond = Template.bind({});
LPBond.args = {
  icon: logo24,
  pairIcon: logo24,
  lpPairIcon: usdcLogo,
};
