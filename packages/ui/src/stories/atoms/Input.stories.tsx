import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Input } from "components/atoms/Input";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Input",
  component: Input,
  argTypes: {},
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Wen dapp?",
  subText: "Enter seedphrase above",
};

export const WithError = Template.bind({});
WithError.args = {
  ...Primary.args,
  errorMessage: "This is an error",
};
