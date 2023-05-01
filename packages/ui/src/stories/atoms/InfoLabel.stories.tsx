import { Meta, StoryFn } from "@storybook/react";
import { InfoLabel } from "components/atoms/InfoLabel";

export default {
  title: "Design System/Atoms/InfoLabel",
  component: InfoLabel,
} as Meta<typeof InfoLabel>;

const Stacked: StoryFn<typeof InfoLabel> = (args) => (
  <div className="flex gap-x-2">
    <InfoLabel {...args} />
    <InfoLabel {...args} />
    <InfoLabel {...args} />
    <InfoLabel {...args} />
  </div>
);

export const Primary = {
  args: {
    label: "Total Value Bonded",
    tooltip: "Lorem ipsum etc stuff this a long tooltip wagmi oke",
    children: "$26.5M",
  },
};

export const Multiple = {
  render: Stacked,

  args: {
    label: "Total Value Bonded",
    tooltip: "Lorem ipsum etc stuff this a long tooltip wagmi oke",
    children: "$26.5M",
  },
};

export const Small = {
  args: {
    label: "Current Ohm Price",
    children: "10.25$",
    small: true,
    reverse: true,
  },
};
