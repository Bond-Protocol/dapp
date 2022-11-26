//@ts-nocheck
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InfoLabel } from "../../components/atoms/InfoLabel";

export default {
  title: "Components/Atoms/InfoLabel",
  component: InfoLabel,
} as ComponentMeta<typeof InfoLabel>;

const Template: ComponentStory<typeof InfoLabel> = (args) => (
  <InfoLabel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: "Total Value Bonded",
  tooltip: "2) h",
  children: "$26.5M",
};
