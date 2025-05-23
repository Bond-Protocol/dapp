import { create } from "@storybook/theming";

export const colors = [
  { name: "covenant", value: "#12172B" },
  { name: "bond-blue", value: "#40749b" },
  { name: "texas-rose", value: "#F2A94A" },
  { name: "champagne", value: "#F0DEC4" },
];

const dark = "#19191a";
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
