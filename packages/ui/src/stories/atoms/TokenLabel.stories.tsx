import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenLabel } from "components/atoms/TokenLabel";
import baseIcon from "../../assets/logo-24.svg";

export default {
  title: "Components/Atoms/TokenLabel",
  component: TokenLabel,
  argTypes: {},
} as ComponentMeta<typeof TokenLabel>;

const Template: ComponentStory<typeof TokenLabel> = (args) => (
  <TokenLabel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: "OHM",
  logo: baseIcon,
};

export const SubText = Template.bind({});
SubText.args = {
  ...Primary.args,
  secondary: "10012,23",
};

export const Wrapped = Template.bind({});
Wrapped.args = {
  ...Primary.args,
  wrapped: true,
};
