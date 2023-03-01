import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LineChart } from "../../components/charts/LineChart";

import data from "./mock-data";

export default {
  title: "Components/Charts/LineChart",
  component: LineChart,
  argTypes: {},
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = (args) => (
  <div className="">
    <LineChart {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  data,
};
