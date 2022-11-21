import { create } from "@storybook/theming";
import { colors } from "../contants.json";

const dark = colors.find(({ name }) => name === "covenant").value;
const texas = colors.find(({ name }) => name === "texas-rose").value;

export default create({
  base: "dark",
  colorPrimary: texas,
  colorSecondary: texas,
  brandTitle: "BondProtocol DS",
  brandUrl: "https://bondprotocol.finance",
  brandImage: "/logo.svg",
  brandTarget: "_self",
  fontBase: '"Jakarta", sans-serif',

  appBg: dark,
  appContentBg: dark,
  barSelectedColor: texas,
  barBg: dark,
  inputBorder: "grey",
  inputBg: dark,
});
