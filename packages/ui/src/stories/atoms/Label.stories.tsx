import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Label } from "../../components/atoms/Label";
import logo from "../../assets/logo-24.svg";
import { Link, Tooltip } from "../../components/atoms";

export default {
  title: "Design System/Atoms/Label",
  component: Label,
  argTypes: {},
  args: {
    value: "Label",
  },
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Primary = Template.bind({});

export const Subtext = Template.bind({});
Subtext.args = {
  subtext: "hello",
};

export const Icon = Template.bind({});
Icon.args = {
  icon: logo,
};

export const All = Template.bind({});
All.args = {
  ...Subtext.args,
  ...Icon.args,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Icon.args,
  value: null,
  subtext: null,
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  children: (
    <Tooltip
      content="1) What"
      iconWidth={13.3}
      iconClassname="pt-0.5 ml-1 fill-white my-auto"
    />
  ),
};

export const WithLink = Template.bind({});
WithLink.args = {
  children: <Link href="" iconClassName="ml-1.5" />,
};
