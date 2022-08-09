/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");
const { colors } = require("./contants.json");

const brandColors = colors.reduce(
  (acc, c) => ({
    ...acc,
    ["brand-" + c.name]: c.value,
  }),
  {}
);

module.exports = withMT({
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: brandColors,
      fontFamily: {
        sans: ["PPFraktionSans", ...defaultTheme.fontFamily.sans],
        jakarta: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "PPFraktionSans",
          fontWeight: "700",
          src: "url(/fonts/PPFraktionSans-Bold.woff2) format('woff2')",
        },
      });
    }),
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "800",
          src: "url(/fonts/PlusJakartaSans-Medium.woff) format('woff')",
        },
      });
    }),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
});
