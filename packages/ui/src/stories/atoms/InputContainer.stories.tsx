import { StoryFn, Meta } from "@storybook/react";
import { InputModal } from "components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/InputModal",
  component: InputModal,
  argTypes: {},
} as Meta<typeof InputModal>;

export const Primary = {
  args: {
    children: "hello",
  },
};

export const WithLabel = {
  args: {
    label: "Wagmi?",
    ModalContent: () => <div />,
  },
};
