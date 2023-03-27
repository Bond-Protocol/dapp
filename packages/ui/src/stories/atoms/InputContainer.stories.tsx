import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InputModal } from "components/atoms/InputModal";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/InputModal",
  component: InputModal,
  argTypes: {},
} as ComponentMeta<typeof InputModal>;

const Template: ComponentStory<typeof InputModal> = (args) => (
  <InputModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: "hello",
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: "Wagmi?",
  ModalContent: () => <div />,
};
