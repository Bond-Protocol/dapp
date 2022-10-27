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
      screens: {
        xs: "100px",
        fml: "600px",
      },
      colors: {
        ...brandColors,
        light: {
          base: '#14182D',
          primary: {
            DEFAULT: "#40749B",
            50: "#9DBBC4",
            300: "#6589A7",
            500: "#40749B",
            900: "#14182D",
          },
          secondary: { DEFAULT: "#E7AC5C", 30: "#F4DFAC" },
          success: "#88F6D7",
          neutral: "#A8A8A8",
          grey: "#737373",
          tooltip: "#090B15",
        },
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
        faketion: ["PlusJakartaSans", ...defaultTheme.fontFamily.mono],
        inter: ["Inter", ...defaultTheme.fontFamily.mono],
      },
      opacity: {
        15: ".15",
        20: ".20",
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      //JAKARTA
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "200",
          src: "url(/fonts/PlusJakartaSans-ExtraLight.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "300",
          src: "url(/fonts/PlusJakartaSans-Light.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "400",
          src: "url(/fonts/PlusJakartaSans-Regular.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "500",
          src: "url(/fonts/PlusJakartaSans-Medium.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "600",
          src: "url(/fonts/PlusJakartaSans-SemiBold.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "700",
          src: "url(/fonts/PlusJakartaSans-Bold.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "PlusJakartaSans",
          fontWeight: "800",
          src: "url(/fonts/PlusJakartaSans-ExtraBold.woff2) format('woff2')",
        },
      });

      //INTER
      addBase({
        "@font-face": {
          fontFamily: "Inter",
          fontWeight: "500",
          src: "url(/fonts/Inter-Regular.woff2) format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Inter",
          fontWeight: "800",
          src: "url(/fonts/Inter-Bold.woff2) format('woff2')",
        },
      });

      //FAKE Fraktion
      addBase({
        "@font-face": {
          fontFamily: "POEVetica",
          fontWeight: "700",
          src: "url(/fonts/POE-Vetica-Mono.woff) format('woff')",
        },
      });

      addBase({
        "@font-face": {
          fontFamily: "POEVetica",
          fontWeight: "800",
          src: "url(/fonts/POE-Vetica-Mono-Bold.woff) format('woff')",
        },
      });
    }),

    function({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
});
