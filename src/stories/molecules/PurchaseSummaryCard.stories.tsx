import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SummaryCard } from "components/molecules/SummaryCard";

export default {
  title: "Components/Molecules/SummaryCard",
  component: SummaryCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SummaryCard>;

const Template: ComponentStory<typeof SummaryCard> = (args) => (
  <SummaryCard {...args} />
);

const fields = [
  { label: "You will get", value: "18 OHM" },
  { label: "Tooltip-me", value: "0.01231 DAI", tooltip: "ok" },
  { label: "alsdk", value: "asodko" },
  { label: "alsdk", value: "asodko" },
  { label: "alsdk", value: "asodko" },
];

export const Primary = Template.bind({});
Primary.args = {
  fields,
};
