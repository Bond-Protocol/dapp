import {ComponentMeta, ComponentStory} from "@storybook/react";
import {FlatSelect} from "../components/atoms/FlatSelect";

export default {
  title: "Components/Atoms/FlatSelect",
  component: FlatSelect,
} as ComponentMeta<typeof FlatSelect>;

const Template: ComponentStory<typeof FlatSelect> = (args) => (
  <FlatSelect {...args} />
);

const options = [
  { label: "SOON™", value: 1 },
  { label: "WAGMI", value: 2 },
];

export const Primary = Template.bind({});
Primary.args = {
  options,
};

export const Secondary = Template.bind({});
Secondary.args = {
  options,
  label: "Wen dApp?",
};
