import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ActionInfoList } from "../../components/atoms/ActionInfoList";
import logo from "../../assets/icon-logo.png";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Molecules/ActionInfoList",
  component: ActionInfoList,
  argTypes: {},
} as ComponentMeta<typeof ActionInfoList>;

const Template: ComponentStory<typeof ActionInfoList> = (args) => (
  <ActionInfoList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  fields: [
    { leftLabel: "You bond", rightLabel: "123 OHM-DAI" },
    { leftLabel: "You will get", rightLabel: "3.33 OHM" },
    {
      leftLabel: "Available in bond",
      rightLabel: "1,250.55 OHM",
      tooltip: "pls mi familia",
    },
    {
      leftLabel: "Network fee",
      rightLabel: "0.001 ETH",
      tooltip: "0.001? lmao gl",
    },
    {
      leftLabel: "Bond contract",
      rightLabel: "View on etherscan",
      link: "ok",
    },
  ],
};
