import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  TokenLabel,
  WrappedTokenLabel,
  InputTokenLabel,
} from "../components/atoms/TokenLabel";
import baseIcon from "../assets/icons/eth-icon.svg";

export default {
  title: "Components/Atoms/TokenLabel",
  component: TokenLabel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TokenLabel>;

const Base: ComponentStory<typeof TokenLabel> = (args) => (
  <TokenLabel {...args} />
);

const WithWrap: ComponentStory<typeof TokenLabel> = (args) => (
  <WrappedTokenLabel {...args} />
);
const WithInput: ComponentStory<typeof TokenLabel> = (args) => (
  <InputTokenLabel {...args} />
);

export const Primary = Base.bind({});
Primary.args = {
  label: "OHM",
  logo: baseIcon,
};

export const SubText = Base.bind({});
SubText.args = {
  label: "OHM",
  logo: baseIcon,
  secondary: "10012,23",
};

export const Wrapped = WithWrap.bind({});
Wrapped.args = Primary.args;

export const Input = WithInput.bind({});
Input.args = Primary.args;
