import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProjectionChart } from "components";

import data from "./btc-price";

export default {
  title: "Components/Charts/ProjectionChart",
  component: ProjectionChart,
  argTypes: {},
} as ComponentMeta<typeof ProjectionChart>;

const Template: ComponentStory<typeof ProjectionChart> = (args) => (
  <div className="">
    <ProjectionChart {...args} className="h-[30vh] w-[35vw]" />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  payoutTokenSymbol: "AFX",
  data,
};
