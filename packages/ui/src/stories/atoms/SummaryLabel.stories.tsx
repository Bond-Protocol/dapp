import { ComponentStory, ComponentMeta } from "@storybook/react";
import logo from "assets/icons/ethereum.svg";
import { SummaryLabel, Link, Tooltip } from "components";

export default {
  title: "Design System/Atoms/SummaryLabel",
  component: SummaryLabel,
  argTypes: {},
  args: {
    value: "ETH",
  },
} as ComponentMeta<typeof SummaryLabel>;

const Template: ComponentStory<typeof SummaryLabel> = (args) => (
  <SummaryLabel {...args} />
);

export const Primary = Template.bind({});

export const Subtext = Template.bind({});
Subtext.args = {
  subtext: "BOND TOKEN",
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

export const WithLink = Template.bind({});
WithLink.args = {
  ...All.args,
  href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};
