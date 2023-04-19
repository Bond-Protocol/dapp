import { StoryFn, Meta } from "@storybook/react";
import { ModalDecorator } from "../decorators";

import { Modal, SelectDateDialog } from "components";

export default {
  title: "Components/Modals/SelectDate",
  component: SelectDateDialog,
  decorators: [ModalDecorator],
} as Meta<typeof Modal>;

export const Primary = {
  args: {},
};
