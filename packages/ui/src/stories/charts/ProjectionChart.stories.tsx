import { StoryFn, Meta } from "@storybook/react";
import { ProjectionChart } from "components";

import data from "./btc-price";

export default {
  title: "Components/Charts/ProjectionChart",
  component: ProjectionChart,
  argTypes: {},
} as Meta<typeof ProjectionChart>;

const Template: StoryFn<typeof ProjectionChart> = (args) => (
  <div className="">
    <ProjectionChart {...args} className="h-[30vh] w-[35vw]" />
  </div>
);

export const Primary = {
  render: Template,

  args: {
    payoutTokenSymbol: "AFX",
    data,
  },
};
