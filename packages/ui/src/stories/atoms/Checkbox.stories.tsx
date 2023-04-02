import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Checkbox } from "components";

export default {
  title: "Design System/Atoms/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  startChecked: true,
};
