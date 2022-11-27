import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Table } from "../../components/molecules/Table";

export default {
  title: "Components/Molecules/Table",
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Table>;

const Base: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Primary = Base.bind({});
Primary.args = {};
