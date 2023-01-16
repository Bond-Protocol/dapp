//@ts-nocheck
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenLogoV2 } from "../../components/atoms/TokenLogo";
import logo24 from "../../assets/icon-logo.png";

const usdcLogo =
  "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/USDC.png";

export default {
  title: "Components/Atoms/TokenLogo",
  component: TokenLogoV2,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TokenLogoV2>;

const Template: ComponentStory<typeof TokenLogoV2> = (args) => (
  <TokenLogoV2 {...args} />
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
