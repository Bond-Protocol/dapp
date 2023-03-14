import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Switch } from "components/atoms/Switch";

export default {
  title: "Design System/Atoms/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Primary = Template.bind({});

export const Label = Template.bind({});
Label.args = {
  label: "Wagmi",
};
