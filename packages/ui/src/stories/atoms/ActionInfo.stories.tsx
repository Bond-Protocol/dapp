import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Chip } from "../../components/atoms/Chip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/Chip",
  component: Chip,
  argTypes: {},
} as ComponentMeta<typeof Chip>;

const values = ["25%", "50%", "75%", "MAX"];

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

const Multi: ComponentStory<typeof Chip> = (args) => (
  <div className="child:mx-1">
    {values.map((v) => (
      <Chip>{v}</Chip>
    ))}
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  children: "33%",
};

export const Multiple = Multi.bind({});
