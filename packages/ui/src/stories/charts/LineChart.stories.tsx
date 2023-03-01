import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LineChart } from "../../components/charts/LineChart";

export default {
  title: "Components/Charts/LineChart",
  component: LineChart,
  argTypes: {},
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = (args) => (
  <LineChart {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  className: "text-red-500 fill-red-500",
};
