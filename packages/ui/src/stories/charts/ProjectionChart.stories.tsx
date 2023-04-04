import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProjectionChart } from "components";

import data from "./btc-price";
import { generateDiscountedPrices } from "./projection-algorithm";

let maxDiscount = 2;
let triggerCount = 7;
let minDiscount = 3;

const prices = generateDiscountedPrices(
  data,
  maxDiscount,
  triggerCount,
  minDiscount
);

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
  data: prices,
};
