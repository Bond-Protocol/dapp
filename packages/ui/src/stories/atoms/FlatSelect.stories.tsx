import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FlatSelect } from "components/atoms/FlatSelect";
import { ReactComponent as SawLineIcon } from "assets/icons/saw-line.svg";
import { ReactComponent as LineIcon } from "assets/icons/line.svg";

export default {
  title: "Design System/Atoms/FlatSelect",
  component: FlatSelect,
} as ComponentMeta<typeof FlatSelect>;

const Template: ComponentStory<typeof FlatSelect> = (args) => (
  <FlatSelect {...args} />
);

const options = [
  {
    label: "DYNAMIC",
    Icon: SawLineIcon,
    value: 1,
  },
  {
    label: "FIXED",
    Icon: LineIcon,
    value: 2,
  },
];

export const Primary = Template.bind({});
Primary.args = {
  options,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  options,
  label: "Wen dApp?",
};
