import { Meta, StoryFn } from "@storybook/react";
import { IconCaroussel } from "components/molecules";
import ethLogo from "assets/icons/ethereum.svg";

export default {
  title: "Design System/Molecules/IconCaroussel",
  component: IconCaroussel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof IconCaroussel>;

const icons = [
  { src: ethLogo, id: "1" },
  { src: ethLogo, id: 42161 },
];

export const Primary = {
  args: {
    icons,
    selected: "1",
  },
};
