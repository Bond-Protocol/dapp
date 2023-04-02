import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ModalDecorator } from "../decorators";

import { Modal, SelectDateDialog } from "components";

export default {
  title: "Components/Modals/SelectDate",
  component: SelectDateDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof SelectDateDialog> = (args) => (
  <SelectDateDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
