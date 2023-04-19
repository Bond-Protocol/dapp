import { Meta, StoryFn } from "@storybook/react";
import { TokenLogo } from "components";
import logo24 from "assets/logo-24.svg";

const usdcLogo =
  "https://storageapi.fleek.co/fc635ae1-c8aa-4181-b7db-801a533b8fa9-bucket/USDC.png";

export default {
  title: "Design System/Atoms/TokenLogo",
  component: TokenLogo,
} as Meta<typeof TokenLogo>;

export const Single = {
  args: {
    icon: logo24,
  },
};

export const Bond = {
  args: {
    icon: usdcLogo,
    pairIcon: logo24,
  },
};

export const LPBond = {
  args: {
    icon: logo24,
    pairIcon: logo24,
    lpPairIcon: usdcLogo,
  },
};
