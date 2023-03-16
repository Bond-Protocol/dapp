//@ts-nocheck
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InfoLabel } from "../../components/atoms/InfoLabel";

export default {
  title: "Design System/Atoms/InfoLabel",
  component: InfoLabel,
} as ComponentMeta<typeof InfoLabel>;

const Template: ComponentStory<typeof InfoLabel> = (args) => (
  <InfoLabel {...args} />
);

const Stacked: ComponentStory<typeof InfoLabel> = (args) => (
  <div className="flex gap-x-2">
    <InfoLabel {...args} />
    <InfoLabel {...args} />
    <InfoLabel {...args} />
    <InfoLabel {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  label: "Total Value Bonded",
  tooltip: "Lorem ipsum etc stuff this a long tooltip wagmi oke",
  children: "$26.5M",
};

export const Multiple = Stacked.bind({});
Multiple.args = {
  label: "Total Value Bonded",
  tooltip: "Lorem ipsum etc stuff this a long tooltip wagmi oke",
  children: "$26.5M",
};
