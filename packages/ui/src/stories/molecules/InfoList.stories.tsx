import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InfoList } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Molecules/InfoList",
  component: InfoList,
  argTypes: {},
} as ComponentMeta<typeof InfoList>;

const Template: ComponentStory<typeof InfoList> = (args) => (
  <InfoList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  fields: [
    { leftLabel: "Price Model", rightLabel: "Dynamic" },
    { leftLabel: "Initial Price", rightLabel: "3.33 OHM per ETH" },
    {
      leftLabel: "Minimum Price",
      rightLabel: "1 OHM per ETH",
      tooltip: "pls mi familia",
    },
    {
      leftLabel: "Max Bond Size",
      rightLabel: "100 OHM",
    },
    {
      leftLabel: "Total Max Bonds",
      rightLabel: "10",
    },
  ],
};
