import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Chip } from "components/atoms/Chip";

export default {
  title: "Design System/Atoms/Chip",
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "7D",
};

export const Selected = Template.bind({});
Selected.args = {
  selected: true,
  children: "30D",
};

export const Multiple: ComponentStory<typeof Chip> = (args) => (
  <div className="flex gap-x-1">
    <Chip {...args} />
    <Chip {...args} selected />
    <Chip {...args} />
    <Chip {...args} />
  </div>
);

Multiple.args = {
  children: "33D",
};
