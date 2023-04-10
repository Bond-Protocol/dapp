import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Modal } from "components";

import { SelectEndDateDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/SelectEndDate",
  component: SelectEndDateDialog,
  decorators: [ModalDecorator],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof SelectEndDateDialog> = (args) => (
  <SelectEndDateDialog {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  startDate: new Date(),
  onSubmit: () => {},
};
