import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "components";

export default {
  title: "Design System/Molecules/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

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

export const Primary = Template.bind({});

Primary.args = {
  open: true,
  children: Children,
  title: "Transaction Confirmation",
};

export const OverElements = Primary;
OverElements.decorators = [Background];
