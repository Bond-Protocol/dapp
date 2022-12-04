import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";

export default {
  title: "Components/Molecules/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

const Background = (Story) => (
  <div className="h-[100vh]">
    <Story />
  </div>
);

const Children = (
  <div>
    <p className="text-center">many confirmation, such tx</p>
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  open: true,
  children: Children,
  title: "Transaction",
};

export const OverElements = Primary;
OverElements.decorators = [Background];
