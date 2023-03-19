import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ActionCard } from "../../components/molecules/ActionCard";

export default {
  title: "Design System/Molecules/ActionCard",
  component: ActionCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ActionCard>;

const Template: ComponentStory<typeof ActionCard> = (args) => (
  <ActionCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Wagmi?",
  leftLabel: "LESGOOOO",
  rightLabel: "Fat nope-Nope",
  onClickRight: () => {},
};
