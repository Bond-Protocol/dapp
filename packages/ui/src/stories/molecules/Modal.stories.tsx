import { StoryFn, Meta } from "@storybook/react";
import { Modal } from "components";

export default {
  title: "Design System/Molecules/Modal",
  component: Modal,
} as Meta<typeof Modal>;

const Background = (Story: any) => (
  <div className="h-[100vh]">
    <Story />
  </div>
);

const Children = (
  <div>
    <p className="h-8 text-center">many confirmation, such tx</p>
    <p className="h-8 text-center">many confirmation, such tx</p>
    <p className="h-8 text-center">many confirmation, such tx</p>
    <p className="h-8 text-center">many confirmation, such tx</p>
  </div>
);

export const Primary = {
  args: {
    open: true,
    children: Children,
    title: "Transaction Confirmation",
  },
};

export const OverElements = Primary;
OverElements.decorators = [Background];
