import { StoryFn, Meta } from "@storybook/react";
import { ProjectionChart } from "components";

import data from "./btc-price";

export default {
  title: "Components/Charts/ProjectionChart",
  component: ProjectionChart,
  argTypes: {},
} as Meta<typeof ProjectionChart>;

const Template: StoryFn<typeof ProjectionChart> = (args) => (
  <div className="h-[80vh] w-[85vw]">
    <ProjectionChart {...args} className="" />
  </div>
);

export const Primary = {
  render: Template,

  args: {
    payoutTokenSymbol: "AFX",
    data,
  },
};
