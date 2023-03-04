import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FilterBox } from "../../components/molecules/FilterBox";

export default {
  title: "Components/Molecules/FilterBox",
  component: FilterBox,
  argTypes: {},
} as ComponentMeta<typeof FilterBox>;

const Template: ComponentStory<typeof FilterBox> = (args) => (
  <FilterBox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
