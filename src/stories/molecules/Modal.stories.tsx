import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "../../components/molecules/Modal";

export default {
  title: "Components/Molecules/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

const Background = (Story) => (
  <div className="h-[100vh] bg-brand-texas-rose">
    <Story />
  </div>
);

const Children = (
  <div>
    <p>haiii</p>
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
