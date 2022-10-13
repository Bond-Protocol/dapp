import { LineChart } from "../components/organisms/Chart";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { prices, discounts } from "../../src/utils/mock-data";

const data = [
  { label: "Price", data: discounts },
  { label: "Discount", data: prices },
];

export default {
  title: "Components/Organisms/Chart",
  component: LineChart,
  argTypes: {},
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = (args) => (
  <LineChart {...args} />
);

export const Primary = Template.bind({});
Primary.args = { data };
