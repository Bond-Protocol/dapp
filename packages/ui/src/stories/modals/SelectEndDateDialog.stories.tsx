import { StoryFn, Meta } from "@storybook/react";
import { Modal } from "components";

import { SelectEndDateDialog } from "components";

import { ModalDecorator } from "../decorators";

export default {
  title: "Components/Modals/SelectEndDate",
  component: SelectEndDateDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {
    startDate: new Date(),
    onSubmit: () => {},
  },
};
