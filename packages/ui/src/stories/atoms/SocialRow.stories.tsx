import { StoryFn, Meta } from "@storybook/react";
import { SocialRow } from "components/atoms/SocialRow";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Atoms/SocialRow",
  component: SocialRow,
  argTypes: {},
} as Meta<typeof SocialRow>;

export const Primary = {
  args: {
    discord: "https://bondprotocol.finance",
    gitbook: "http://bondprotocol.finance",
    github: "https://bondprotocol.finance",
    medium: "https://bondprotocol.finance",
    twitter: "https://bondprotocol.finance",
    telegram: "https://bondprotocol.finance",
    everipedia: "https://bondprotocol.finance",
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    width: 13,
  },
};
