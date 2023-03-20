import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ManualVestingTermInput } from "../../components/molecules/ManualVestingTermInput";

export default {
  title: "Design System/Molecules/ManualVestingTermInput",
  component: ManualVestingTermInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ManualVestingTermInput>;

const Template: ComponentStory<typeof ManualVestingTermInput> = (args) => (
  <ManualVestingTermInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};

export const Warning = Template.bind({});
Warning.args = {
  defaultValue: "420",
};

export const Error = Template.bind({});
Error.args = {
  limit: 270,
  defaultValue: "420",
};
