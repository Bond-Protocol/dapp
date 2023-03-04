import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PieChart } from "../../components/charts/PieChart";

import data from "./mock-data";

export default {
  title: "Components/Charts/PieChart",
  component: PieChart,
  argTypes: {},
} as ComponentMeta<typeof PieChart>;

const Template: ComponentStory<typeof PieChart> = (args) => (
  <div className="">
    <PieChart {...args} className="h-[40vh] w-[45vw]" />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  data,
  payoutTokenSymbol: "GMX",
};
