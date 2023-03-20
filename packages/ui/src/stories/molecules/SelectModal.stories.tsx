import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SelectModal } from "../../components/molecules/SelectModal";
import { SelectVestingDialog } from "components/modals/SelectVestingDialog";

import instantIcon from "../../assets/icons/vesting/instant.svg";
import fastIcon from "../../assets/icons/vesting/fast.svg";
import normalIcon from "../../assets/icons/vesting/normal.svg";
import slowIcon from "../../assets/icons/vesting/slow.svg";

export default {
  title: "Design System/Molecules/SelectModal",
  component: SelectModal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SelectModal>;

const Template: ComponentStory<typeof SelectModal> = (args) => (
  <SelectModal {...args} />
);

const options = [
  { id: "instant", label: "Instant", value: "instant", image: instantIcon },
  { id: "7d", label: "7 days", value: "7", image: fastIcon },
  { id: "14d", label: "14 days", value: "14", image: normalIcon },
  { id: "28d", label: "28 days", value: "28", image: slowIcon },
];

export const Primary = Template.bind({});
Primary.args = {
  options,
  ModalContent: SelectVestingDialog,
};
