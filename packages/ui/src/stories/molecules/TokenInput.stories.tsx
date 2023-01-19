import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenInput } from "components/atoms/TokenInput";
import baseIcon from "../../assets/logo-24.svg";

export default {
  title: "Components/Molecules/TokenInput",
  component: TokenInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TokenInput>;

const Base: ComponentStory<typeof TokenInput> = (args) => (
  <TokenInput {...args} />
);

export const Primary = Base.bind({});
Primary.args = {
  symbol: "OHM",
  logo: baseIcon,
};
