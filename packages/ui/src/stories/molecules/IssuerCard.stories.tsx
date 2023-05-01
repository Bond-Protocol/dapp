import { Meta, StoryFn } from "@storybook/react";
import { IssuerCard } from "components";
import logo from "assets/logo-24.svg";

export default {
  title: "Design System/Molecules/IssuerCard",
  component: IssuerCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    markets: [1, 2, 3],
    tbv: 33420420,
    issuer: {
      id: "bp",
      name: "YourDao",
      logoUrl: logo,
    },
  },
} as Meta<typeof IssuerCard>;

export const Primary = {};
