import { Meta, StoryFn } from "@storybook/react";
import { FlatSelect } from "components/atoms/FlatSelect";
import { ReactComponent as SawLineIcon } from "assets/icons/saw-line.svg";
import { ReactComponent as LineIcon } from "assets/icons/line.svg";

export default {
  title: "Design System/Atoms/FlatSelect",
  component: FlatSelect,
} as Meta<typeof FlatSelect>;

const options = [
  {
    label: "DYNAMIC",
    Icon: SawLineIcon,
    value: 1,
  },
  {
    label: "FIXED",
    Icon: LineIcon,
    value: 2,
  },
];

export const Primary = {
  args: {
    options,
  },
};

export const WithLabel = {
  args: {
    options,
    label: "Wen dApp?",
  },
};
