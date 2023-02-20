import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SearchBar } from "../../components/molecules/SearchBar";

export default {
  title: "Components/Molecules/SearchBar",
  component: SearchBar,
  argTypes: {},
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
