import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OrderbookChart } from "../../components/charts/OrderbookChart";

import data from "./mock-data";

export default {
  title: "Components/Charts/OrderbookChart",
  component: OrderbookChart,
  argTypes: {},
} as ComponentMeta<typeof OrderbookChart>;

const Template: ComponentStory<typeof OrderbookChart> = (args) => (
  <div className="h-[40vh] w-[45vw]">
    <OrderbookChart {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  data,
};
