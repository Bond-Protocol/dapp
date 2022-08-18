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
      colors: {
        ...brandColors,
        light: {
          primary: {
            500: "#40749B",
            900: "#14182D",
          },
        },
      },
      fontFamily: {
        sans: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
        fraktion: ["FraktionSans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "FraktionSans",
          fontWeight: "700",
          src: "url(/fonts/PPFraktionSans-Bold.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "800",
          src: "url(/fonts/PlusJakartaSans-Medium.woff) format('woff')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "400",
          src: "url(/fonts/PlusJakartaSans-Light.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "200",
          src: "url(/fonts/PlusJakartaSans-ExtraLight.woff2) format('woff2')",
        },
      });
    }),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
});
