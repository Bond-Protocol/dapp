import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Skeleton } from "../../components/atoms/Skeleton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Atoms/Skeleton",
  component: Skeleton,
  argTypes: {},
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = (args) => (
  <Skeleton {...args} />
);

export const Primary = Template.bind({});
