import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tooltip } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/Tooltip",
  component: Tooltip,
  argTypes: {},
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  content: "hai im tooltip",
  iconClassname: "fill-light-secondary-10",
};
